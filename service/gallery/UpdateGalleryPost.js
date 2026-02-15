import AppError from "../../utils/appError.js"
import prisma from "../../utils/prisma.js"
import { supabase } from "../../utils/supabase.js"

export const updateGalleryPost = async (req) => {
    let uploadedFileNames = []
    try {
        const { id } = req.params
        const { title, caption, tags, existingImages } = req.body
        const files = req.files // New images

        if (!id) throw new AppError('Post ID is required', 400)
        if (!title || !caption || (!tags && !Array.isArray(tags))) {
            throw new AppError('Title, caption, and tags are required', 400)
        }

        // 1. Verify existence
        const existingPost = await prisma.gallery_post.findUnique({
            where: { id },
            include: { 
                images: true,
                galleryPostTags: { include: { tag: true } }
            }
        })
        if (!existingPost) throw new AppError('Gallery post not found', 404)

        // Parse tags
        let parsedTags = []
        if (typeof tags === 'string') {
            try {
                parsedTags = JSON.parse(tags)
            } catch (e) {
                parsedTags = tags.split(',').map(t => t.trim()).filter(Boolean)
            }
        } else if (Array.isArray(tags)) {
            parsedTags = tags
        }
        parsedTags = [...new Set(parsedTags.map(t => t.toLowerCase()))]

        // Parse existingImages list (sent from frontend as kept images)
        let keptImageUrls = []
        if (typeof existingImages === 'string') {
            try { keptImageUrls = JSON.parse(existingImages) } catch (e) { keptImageUrls = [existingImages] }
        } else if (Array.isArray(existingImages)) {
            keptImageUrls = existingImages
        }

        // 2. Identify images to delete from Supabase and DB
        const imagesToDelete = existingPost.images.filter(img => !keptImageUrls.includes(img.image_url))
        
        // 3. Parallel Upload New Images to Supabase
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
        const uploadPromises = (files || []).map(async (file) => {
            const fileName = `${uniqueSuffix}-${file.originalname}`
            const { error } = await supabase.storage.from('gallery').upload(fileName, file.buffer, {
                contentType: file.mimetype
            })
            if (error) throw error
            uploadedFileNames.push(fileName)
            return supabase.storage.from('gallery').getPublicUrl(fileName).data.publicUrl
        })
        const newImageUrls = await Promise.all(uploadPromises)

        // 4. Atomic Database Transaction
        const updatedResult = await prisma.$transaction(async (tx) => {
            // A. Update post details
            const post = await tx.gallery_post.update({
                where: { id },
                data: { title, caption },
                select: { id: true }
            })

            // B. Update Tags
            // Upsert all provided tags
            const tagRecords = await Promise.all(
                parsedTags.map(tagName =>
                    tx.gallery_tag.upsert({
                        where: { name: tagName },
                        update: {},
                        create: { name: tagName }
                    })
                )
            )

            // Replace existing post-tag associations
            await tx.gallery_post_tag.deleteMany({ where: { post_id_fk: id } })
            await tx.gallery_post_tag.createMany({
                data: tagRecords.map(tag => ({
                    post_id_fk: id,
                    tag_id_fk: tag.id
                }))
            })

            // C. Manage Images
            // Delete removed images from DB
            if (imagesToDelete.length > 0) {
                const deleteIds = imagesToDelete.map(img => img.id)
                await tx.gallery_image_tag.deleteMany({ where: { image_id_fk: { in: deleteIds } } })
                await tx.gallery_image.deleteMany({ where: { id: { in: deleteIds } } })
            }

            // Add new images to DB
            const newImageRecords = await Promise.all(
                newImageUrls.map(url =>
                    tx.gallery_image.create({
                        data: {
                            image_url: url,
                            gallery_post_id_fk: id
                        },
                        select: { id: true }
                    })
                )
            )

            // D. Associate tags with new images
            const allCurrentImages = await tx.gallery_image.findMany({ where: { gallery_post_id_fk: id } })
            const imageTagData = []
            allCurrentImages.forEach(img => {
                tagRecords.forEach(tag => {
                    imageTagData.push({
                        image_id_fk: img.id,
                        tag_id_fk: tag.id
                    })
                })
            })

            await tx.gallery_image_tag.deleteMany({ where: { image_id_fk: { in: allCurrentImages.map(i => i.id) } } })
            await tx.gallery_image_tag.createMany({ data: imageTagData })

            return post
        })

        // 5. Cleanup removed images from Supabase storage
        if (imagesToDelete.length > 0) {
            const filesToRemove = imagesToDelete.map(img => {
                const parts = img.image_url.split('/')
                return parts[parts.length - 1]
            })
            await supabase.storage.from('gallery').remove(filesToRemove)
                .catch(err => console.error("Post-update Supabase cleanup failed:", err))
        }

        return {
            success: true,
            message: 'Gallery album updated successfully',
            data: updatedResult
        }

    } catch (error) {
        console.error('Error in updateGalleryPost:', error)
        if (uploadedFileNames.length > 0) {
            await supabase.storage.from('gallery').remove(uploadedFileNames)
                .catch(err => console.error("Rollback cleanup failed:", err))
        }
        if (error instanceof AppError) throw error
        throw new AppError(error.message || 'Error updating gallery post', 500)
    }
}