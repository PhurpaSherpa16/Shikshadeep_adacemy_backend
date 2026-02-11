import { pagination } from "../../utils/pagination.js"
import AppError from "../../utils/appError.js"
import prisma from "../../utils/prisma.js"

export const getAllImages = async (req) => {
    try {
        const { limit, page, start, end } = pagination(req, 10, 50)
        const total_items = await prisma.gallery_image.count()
        const total_pages = Math.ceil(total_items / limit)

        const images = await prisma.gallery_image.findMany({
            select: {
                id: true,
                image_url: true,
                gallery_post_id_fk: true
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: start
        })
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