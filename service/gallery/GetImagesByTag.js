import AppError from "../../utils/appError.js"
import { pagination } from "../../utils/pagination.js"
import prisma from "../../utils/prisma.js"

export const getImagesByTag = async (req) => {

    const { page, limit, skip } = pagination(req, 10, 50)

    try {
        const total_items = await prisma.gallery_image.count({ where: { tags: { some: { tag: { name: req.query.q.toLowerCase() } } } } })
        const total_pages = Math.ceil(total_items / limit)

        const tag = req.query.q

        if (!tag) {
            throw new AppError('Tag is required', 400)
        }

        // Check if tag exists
        const tagExists = await prisma.gallery_tag.findUnique({
            where: { name: tag.toLowerCase() }
        })

        if (!tagExists) {
            throw new AppError('No tag exists', 404)
        }

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
            skip: skip,
            orderBy: { createdAt: 'desc' }
        })

        if (!images || images.length === 0) {
            throw new AppError('No images found for this tag', 404)
        }

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