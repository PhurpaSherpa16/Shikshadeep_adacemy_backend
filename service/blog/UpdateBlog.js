import sharp from "sharp"
import { supabase } from '../../utils/supabase.js';
import AppError from "../../utils/appError.js";
import prisma from "../../utils/prisma.js";

export const updateBlog = async (req) => {
    try {
        const { id } = req.params
        const { title, description, tagName} = req.body
        const file = req.file

        // validation check
        if (!id) {
            throw new AppError("Blog ID is missing", 400)
        }

        // Find blog - check if blog is exist or not
        const existingBlog = await prisma.blog.findUnique({
            where: { id: id }
        })

        if (!existingBlog) {
            throw new AppError("Blog not found", 404)
        }

        // check if all fields are not empty
        if (!title || !description || !tagName) {
            console.log(title, description, tagName);
            throw new AppError("Title, description, and tagName are required fields", 400)
        }

        let tagId = existingBlog.tag_id_fk

        if (tagName) {
            let tag = await prisma.blog_tag.findUnique({
                where: { name: tagName }
            })
            if (!tag) {
                throw new AppError("Tag not found", 404);
            }
            tagId = tag.id
        }

        let newImageUrl = existingBlog.image_url
        let newThumbnailUrl = existingBlog.thumbnail_url

        let newImageName, newThumbnailName

        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
        // check if new image is uploaded
        if (file) {
            newImageName = uniqueSuffix + '-' + file.originalname
            newThumbnailName = uniqueSuffix + '-thumbnail-' + file.originalname

            const { error: imageError } = await supabase.storage.from('blog_images').upload(newImageName,
                file.buffer, {
                contentType: file.mimetype
            })
            if (imageError) {
                console.log('Image upload error', imageError);
                throw new AppError(`Image upload failed, please try again later`, 400)
            }

            const thumbBuffer = await sharp(file.buffer).resize(300, 200).toBuffer()
            const { error: thumbnailError } = await supabase.storage.from('blog_images').upload(newThumbnailName, thumbBuffer,
                { contentType: file.mimetype })
            if (thumbnailError) {
                await supabase.storage.from('blog_images').remove([newImageName])
                console.log('Thumbnail upload error', thumbnailError);
                throw new AppError(`Thumbnail upload failed, please try again later`, 400)
            }

            // images url if new image is uploaded
            newImageUrl = supabase.storage.from('blog_images').getPublicUrl(newImageName).data.publicUrl
            newThumbnailUrl = supabase.storage.from('blog_images').getPublicUrl(newThumbnailName).data.publicUrl
        }

        // update the blog 
        let updatedBlog;
        try {
            updatedBlog = await prisma.blog.update({
                where: { id: id },
                data: {
                    title: title,
                    description: description,
                    image_url: newImageUrl,
                    thumbnail_url: newThumbnailUrl,
                    tag_id_fk: tagId
                }
            })
        } catch (error) {
            // rollback: delete newly uploaded images if DB update fails
            if (file) {
                await supabase.storage.from('blog_images').remove([newImageName, newThumbnailName])
            }
            console.log('Database update error:', error);
            throw new AppError("Failed to update blog, please try again later", 500);
        }

        // if update success and new file was uploaded, delete old images
        if (file) {
            const oldImageName = existingBlog.image_url.split('/').pop()
            const oldThumbnailName = existingBlog.thumbnail_url.split('/').pop()

            const { error: deleteError } = await supabase.storage.from('blog_images').remove([oldImageName, oldThumbnailName])
            if (deleteError) {
                console.log('Error deleting old images from storage:', deleteError);
            }
        }

        return updatedBlog
    }
    catch (error) {
        console.log("Error in createBlog:", error);
        if (error instanceof AppError) throw error;
        throw new AppError(error.message || "Internal Server Error", error.statusCode || 500);
    }
}