import sharp from "sharp"
import { supabase } from '../../utils/supabase.js';
import AppError from "../../utils/appError.js";
import prisma from "../../utils/prisma.js";

export const createBlog = async (req) => {
    let uploadedFiles = []
    try {
        const { title, content, description, tagColor, tagName } = req.body
        const file = req.file

        // Validation
        if (!title || !content || !description || !tagName) {
            throw new AppError("Title, content, description, and tagName are required", 400);
        }
        if (!file) {
            throw new AppError("Image is required. Only jpeg, jpg, png are allowed", 400);
        }

        // 1. Tag processing (can be done while storage is warming up, or first)
        let tag = await prisma.blog_tag.upsert({
            where: { name: tagName.toLowerCase() },
            update: {},
            create: {
                name: tagName.toLowerCase(),
                color: tagColor || "#000000"
            }
        })

        // 2. Parallel image processing and uploads
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
        const imageName = `${uniqueSuffix}-${file.originalname}`
        const thumbnailName = `${uniqueSuffix}-thumbnail-${file.originalname}`

        const uploadPromises = [
            // Upload main image
            supabase.storage.from('blog_images').upload(imageName, file.buffer, { contentType: file.mimetype }),
            // Process and upload thumbnail
            (async () => {
                const thumbBuffer = await sharp(file.buffer).resize(300, 200).toBuffer()
                return supabase.storage.from('blog_images').upload(thumbnailName, thumbBuffer, { contentType: file.mimetype })
            })()
        ]

        const results = await Promise.all(uploadPromises)

        // Check for upload errors
        results.forEach((res, index) => {
            if (res.error) {
                console.error(`Upload failed for ${index === 0 ? 'main image' : 'thumbnail'}:`, res.error)
                throw new AppError(`${index === 0 ? 'Image' : 'Thumbnail'} upload failed`, 400)
            }
        })

        // Keep track of successfully uploaded files for cleanup if DB fails
        uploadedFiles = [imageName, thumbnailName]

        const imageUrl = supabase.storage.from('blog_images').getPublicUrl(imageName).data.publicUrl
        const thumbnailUrl = supabase.storage.from('blog_images').getPublicUrl(thumbnailName).data.publicUrl

        // 3. Database Entry
        try {
            const blog = await prisma.blog.create({
                data: {
                    title,
                    content,
                    description,
                    image_url: imageUrl,
                    thumbnail_url: thumbnailUrl,
                    tag_id_fk: tag.id
                }
            })
            return blog

        } catch (error) {
            console.error('Database error in createBlog:', error)

            // Rollback cleanup
            await supabase.storage.from('blog_images').remove(uploadedFiles)
            .catch(err => console.error("Rollback cleanup failed in createBlog:", err))

            if (error.code === 'P2002') {
                throw new AppError("A blog with this description already exists", 400)
            }
            throw error // Caught by outer catch for cleanup
        }

    } catch (error) {
        console.error("Error in createBlog:", error)

        // Robust Rollback: Cleanup uploaded files on ANY failure
        if (uploadedFiles.length > 0) {
            await supabase.storage.from('blog_images').remove(uploadedFiles)
                .catch(err => console.error("Rollback cleanup failed in createBlog:", err))
        }

        if (error instanceof AppError) throw error
        throw new AppError(error.message || "Failed to create blog entry", error.statusCode || 500)
    }
}