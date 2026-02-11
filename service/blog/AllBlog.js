import AppError from '../../utils/appError.js';
import { pagination } from '../../utils/pagination.js';
import prisma from '../../utils/prisma.js';

export const allBlog = async (req) => {
    const { limit, page, start } = pagination(req, 10, 50)

    try {
        const total_items = await prisma.blog.count()

        const blogs = await prisma.blog.findMany({
            select: {
                id: true,
                title: true,
                description: true,
                thumbnail_url: true,
                createdAt: true,
                tag: {
                    select: {
                        name: true,
                        color: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: start
        })

        if (blogs.length === 0) {
            throw new AppError('No blogs found', 404)
        }

        return {
            total_items,
            total_pages: Math.ceil(total_items / limit),
            current_page_number: page,
            limit_items: limit,
            blogs
        }

    } catch (error) {
        if (error instanceof AppError) {
            throw error
        }
        console.log('Database error : ', error);
        throw new AppError(`Error on fetching blogs, please try again later`, 500)
    }
}