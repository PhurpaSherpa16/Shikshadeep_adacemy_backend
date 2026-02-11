import AppError from "../../utils/appError.js"
import prisma from "../../utils/prisma.js"

export const deleteNoticeBoard = async (req) => {
    try {
        const { id } = req.params

        if (!id) {
            throw new AppError("Notice ID is required", 400)
        }

        const notice = await prisma.school_notice_board.findUnique({
            where: { id }
        })

        if (!notice) {
            throw new AppError("Notice not found", 404)
        }

        const result = await prisma.school_notice_board.delete({
            where: { id }
        })

        return result
    } catch (error) {
        console.log('Error in deleteNoticeBoard', error)
        if (error instanceof AppError) throw error
        throw new AppError(error.message || 'Internal Server Error', error.statusCode || 500)
    }
}
