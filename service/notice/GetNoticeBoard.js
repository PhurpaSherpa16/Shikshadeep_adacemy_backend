import AppError from "../../utils/appError.js"
import prisma from "../../utils/prisma.js"

export const getNoticeBoard = async (req) => {
    try {
        const result = await prisma.school_notice_board.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        })

        return result
    } catch (error) {
        console.log('Error in getNoticeBoard', error)
        throw new AppError(error.message || 'Internal Server Error', error.statusCode || 500)
    }
}
