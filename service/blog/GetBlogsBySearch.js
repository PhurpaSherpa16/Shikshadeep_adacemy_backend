import AppError from "../../utils/appError.js"
import { pagination } from "../../utils/pagination.js"
import prisma from "../../utils/prisma.js"

export const getBlogsBySearch = async (req) => {
    try {
        const { limit, page, start, end } = pagination(req, 10, 50)

        const { q } = req.query

        if (!q) throw new AppError('Search query is required', 400)

        const normalizedQuery = q.trim().toLowerCase()
        console.log(normalizedQuery);
        const blogs = await prisma.blog.findMany({
            select: {
                id: true,
                title: true,
                description: true,
                thumbnail_url: true,
                createdAt: true,
                tag: { select: { name: true, color: true } }
            },
            where: {
                OR: [
                    { title: { contains: normalizedQuery, mode: 'insensitive' } },
                    { description: { contains: normalizedQuery, mode: 'insensitive' } },
                    { content: { contains: normalizedQuery, mode: 'insensitive' } }
                ],
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: start
        })

        console.log(blogs)

        if (blogs.length === 0) throw new AppError('No blogs found for this search query', 404)

        const total_items = await prisma.blog.count({
            where: {
                OR: [
                    { title: { contains: normalizedQuery, mode: 'insensitive' } },
                    { description: { contains: normalizedQuery, mode: 'insensitive' } },
                    { content: { contains: normalizedQuery, mode: 'insensitive' } }
                ]
            }
        })
        return {
            total_items,
            total_pages: Math.ceil(total_items / limit),
            current_page_number: page,
            limit_items: limit,
            blogs
        }
    }
    catch (error) {
        console.log('Error fetching blogs by search', error);
        if (error instanceof AppError) throw error
        throw new AppError('Error fetching blogs by search', 500)
    }
}