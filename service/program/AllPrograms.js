import AppError from "../../utils/appError.js";
import { pagination } from "../../utils/pagination.js";
import prisma from "../../utils/prisma.js";

export const allPrograms = async (req) => {
    try {
        const { limit, page, start } = pagination(req, 9, 50)
        const total_items = await prisma.program.count()
        const total_pages = Math.ceil(total_items / limit)
        const programs = await prisma.program.findMany({
            select: {
                id: true,
                title: true,
                grade: true,
                description: true,
                image_url: true,
                displayOrder: true,
                features: {
                    select: {
                        title: true
                    }
                }
            },
            orderBy: { displayOrder: 'asc' },
            take: limit,
            skip: start
        })

        return {total_items, total_pages, current_page_number: page, limit_items : limit, programs}

    } catch (error) {
        console.error("Error in allPrograms:", error)
        throw new AppError(error.message || "Failed to fetch programs", 500)
    }
}
