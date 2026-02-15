import AppError from '../../utils/appError.js'
import prisma from '../../utils/prisma.js'

export const getSingleBlog = async (req) => {
    try {
        const { id } = req.params

        if (!id) throw new AppError('Blog ID is missing', 400)

        const blog = await prisma.blog.findUnique({
            select: {
                id: true,
                title: true,
                description: true,
                image_url: true,
                thumbnail_url: true,
                createdAt: true,
                updatedAt: true,
                tag: {
                    select: {
                        name: true,
                        color: true
                    }
                }
            }, where: { id: id }
        })
        if (!blog) throw new AppError('Blog not found', 404)
        return blog

    } catch (error) {
        console.log('Error in getSingleBlog:', error);
        if (error instanceof AppError) throw error;
        throw new AppError('Fetching blog failed, please try again later', 500)
    }
}