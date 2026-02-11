import AppError from "../../utils/appError.js";
import { supabase } from "../../utils/supabase.js";
import prisma from "../../utils/prisma.js";

export const deleteBlog = async (req) => {
    try {
        const { id } = req.params
        if (!id) {
            throw new AppError("Blog ID is missing.", 400)
        }

        const tempExistingBlog = await prisma.blog.findUnique({
            where: { id: id }
        })

        if (!tempExistingBlog) {
            throw new AppError("Blog not found", 404)
        }

        const deleteBlog = await prisma.blog.delete({
            where: { id: id }
        })

        const deleteImageURL = await supabase.storage.from('blog_images').remove([tempExistingBlog.image_url])
        const deleteThumbnailURL = await supabase.storage.from('blog_images').remove([tempExistingBlog.thumbnail_url])

        const imageName = tempExistingBlog.image_url.split('/').pop()
        const thumbnailName = tempExistingBlog.thumbnail_url.split('/').pop()

        const { error: errorDeleteImageURL } = await supabase.storage.from('blog_images').remove([imageName, thumbnailName])

        if (errorDeleteImageURL) {
            console.log('Delete error', errorDeleteImageURL);
            throw new AppError(`Delete failed, please try again later`, 400)
        }

        return { message: 'Blog deleted successfully' }

    } catch (error) {
        console.log('Error in deleting blog', error);
        if (error instanceof AppError) {
            throw error
        }
        throw new AppError('Failed to delete blog', 500)
    }
}