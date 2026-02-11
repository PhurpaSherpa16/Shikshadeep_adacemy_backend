import AppError from "../../utils/appError.js"
import { json } from "express"
import { supabase } from "../../utils/supabase.js"
import prisma from "../../utils/prisma.js"

export const uploadImages = async (req) => {
    let uploadedFileNames = []
    try {
        const { title, caption, tags } = req.body
        const files = req.files

        if (!title || !caption || !tags) {
            throw new AppError('Title, caption, and tags are required', 400)
        }

        if (!files || files.length === 0) {
            throw new AppError('At least one image is required', 400)
        }

        // Parse tags reliably
        let parsedTags = []
        try {
            if (typeof tags === 'string') {
                const trimmed = tags.trim()
                if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
                    parsedTags = JSON.parse(trimmed)
                } else {
                    parsedTags = trimmed.split(',').map(t => t.trim()).filter(Boolean)
                }
            } else if (Array.isArray(tags)) {
                parsedTags = tags
            }
            parsedTags = [...new Set(parsedTags.map(t => t.toLowerCase()))]
        } catch (e) {
            console.error("Tag parsing error:", e)
            throw new AppError('Invalid tags format', 400)
        }

        // 1. Parallel Supabase Uploads
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`

        const uploadPromises = files.map(async (file) => {
            const fileName = `${uniqueSuffix}-${file.originalname}`
            const { error } = await supabase.storage.from('gallery').upload(fileName, file.buffer, {
                contentType: file.mimetype
            })

            if (error) throw error

            uploadedFileNames.push(fileName)
            return supabase.storage.from('gallery').getPublicUrl(fileName).data.publicUrl
        })

        const imageUrls = await Promise.all(uploadPromises)

        // 2. Atomic Database Transaction
        const post = await prisma.$transaction(async (tx) => {
            // Create gallery post
            const newPost = await tx.gallery_post.create({
                data: { title, caption },
                select: { id: true }
            })

            // Upsert all tags and get their IDs
            const tagRecords = await Promise.all(
                parsedTags.map(tagName =>
                    tx.gallery_tag.upsert({
                        where: { name: tagName },
                        update: {},
                        create: { name: tagName }
                    })
                )
            )

            // Create post-tag associations
            await tx.gallery_post_tag.createMany({
                data: tagRecords.map(tag => ({
                    post_id_fk: newPost.id,
                    tag_id_fk: tag.id
                }))
            })

            // Create gallery images
            const imageRecords = await Promise.all(
                imageUrls.map(url =>
                    tx.gallery_image.create({
                        data: {
                            image_url: url,
                            gallery_post_id_fk: newPost.id
                        },
                        select: { id: true }
                    })
                )
            )

            // Create image-tag associations for all newly created images
            const imageTagData = []
            imageRecords.forEach(img => {
                tagRecords.forEach(tag => {
                    imageTagData.push({
                        image_id_fk: img.id,
                        tag_id_fk: tag.id
                    })
                })
            })

            await tx.gallery_image_tag.createMany({
                data: imageTagData
            })

            return newPost
        })

        return {
            success: true,
            message: 'Gallery post and images uploaded successfully',
            data: post
        }

    } catch (error) {
        console.error('Error in uploadImages:', error)

        // 3. Robust Cleanup: Remove uploaded files from Supabase on any error
        if (uploadedFileNames.length > 0) {
            await supabase.storage.from('gallery').remove(uploadedFileNames)
                .catch(err => console.error("Rollback cleanup failed:", err))
        }

        if (error.code === 'P2002') {
            throw new AppError('Duplicate entry found. This image or post may already exist.', 400)
        }

        if (error instanceof AppError) throw error
        throw new AppError(error.message || 'Gallery upload failed, please try again.', 500)
    }
}
