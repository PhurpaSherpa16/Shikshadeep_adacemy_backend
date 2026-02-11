import AppError from "../../utils/appError.js"
import prisma from "../../utils/prisma.js"

export const updateGalleryPost = async (req) => {
    try {
        const { id } = req.params
        const { title, caption, tags } = req.body
        const file = req.file

        if (!id) {
            throw new AppError('Post id is required', 400)
        }

        if (!title || !caption || !tags) {
            throw new AppError('Title, caption, and tags are required fields', 400)
        }

        // check if post is exist or not
        const existingPost = await prisma.gallery_post.findUnique({
            where: { id },
        })
        if (!existingPost) {
            throw new AppError('Post not found', 404)
        }

        // update post
        const updatedPost = await prisma.gallery_post.update({
            where: { id },
            data: {
                title,
                caption,
            }
        })
        if (!updatedPost) {
            throw new AppError('Post not updated', 404)
        }

        return updatedPost
    } catch (error) {
        console.log(error);
        if (error instanceof AppError) throw error
        throw new AppError('Error updating post', 500)
    }
}