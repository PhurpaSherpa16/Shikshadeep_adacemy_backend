import AppError from "../../utils/appError.js"
import { pagination } from "../../utils/pagination.js"
import prisma from "../../utils/prisma.js"

export const getImagesByTag = async (req) => {

    const { page, limit, start } = pagination(req, 9, 50)

    try {
        const total_items = await prisma.gallery_image.count({ where: { tags: { some: { tag: { name: req.query.q.toLowerCase() } } } } })
        const total_pages = Math.ceil(total_items / limit)

        const tag = req.query.q

        if (!tag) throw new AppError('Tag is required', 400)

        // Get all images with the tag
        const images = await prisma.gallery_image.findMany({
            where: {
                tags: {
                    some: {
                        tag: {
                            name: tag.toLowerCase()
                        }
                    }
                }
            },
            select: {
                id: true,
                image_url: true,
                post: {
                    select: {
                        id: true,
                        title: true,
                        caption: true
                    }
                },
                tags: {
                    select: {
                        tag: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            },
            take: limit,
            skip: start,
            orderBy: { createdAt: 'desc' }
        })

        if (page > total_pages && total_pages !== 0) throw new AppError('Page exceeds total pages', 400)

        return {
            total_items,
            total_pages,
            current_page_number: page,
            limit_items: limit,
            images
        }
    } catch (error) {
        console.log(error);
        if (error instanceof AppError) throw error
        throw new AppError('Error fetching images', 500)
    }
}