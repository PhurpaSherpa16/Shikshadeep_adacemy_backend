import AppError from "../../utils/appError.js"
import { pagination } from "../../utils/pagination.js"
import prisma from "../../utils/prisma.js"

export const getFlashNoticeForPublic = async (req) => {
    try {
        const {limit, page, start } = pagination(req, 10, 50)

        const [notices, total_items] = await Promise.all([
            prisma.school_flash_notice.findMany({
                where: {
                    isActive: true,
                    endDate: {
                        gte: new Date()
                    },
                    startDate: {
                        lte: new Date()
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                take: limit,
                skip: start
            }),
            prisma.school_flash_notice.count()
        ])

        return {
            notices,
            total_items,
            total_pages: Math.ceil(total_items / limit),
            current_page_number: page,
            limit_items: limit
        }
    } catch (error) {
        console.log('Error in getFlashNotice', error)
        throw new AppError(error.message || 'Internal Server Error', error.statusCode || 500)
    }
}
