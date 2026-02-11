import AppError from "../../utils/appError.js"
import { pagination } from "../../utils/pagination.js"
import prisma from "../../utils/prisma.js"

export const getGalleryPost = async (req) => {
    try {
        const { limit, page, start, end } = pagination(req, 10, 50)
        const total_items = await prisma.gallery_post.count()
        const total_pages = Math.ceil(total_items / limit)
        const galleryPost = await prisma.gallery_post.findMany({
            select: {
                id: true,
                images: {
                    select: {
                        id: true,
                        image_url: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: start
        })
        if (!galleryPost) {
            throw new AppError('Gallery post not found', 404)
        }
        return {
            total_items,
            total_pages,
            current_page_number: page,
            limit_items: limit,
            galleryPost
        }

    } catch (error) {
        console.log(error);
        if (error instanceof AppError) throw error
        throw new AppError('Error fetching gallery post', 500)
    }
}