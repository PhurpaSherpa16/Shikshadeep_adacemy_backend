import AppError from "../../utils/appError.js"
import prisma from "../../utils/prisma.js"

export const updateNoticeBoard = async (req) => {
    try {
        const { id } = req.params
        const { title, content, isActive, startDate, endDate, remarks } = req.body

        if (!id) {
            throw new AppError("Notice ID is required", 400)
        }

        const notice = await prisma.school_notice_board.findUnique({
            where: { id }
        })

        if (!notice) {
            throw new AppError("Notice not found", 404)
        }

        const result = await prisma.school_notice_board.update({
            where: { id },
            data: {
                title: title || notice.title,
                content: content !== undefined ? content : notice.content,
                isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : notice.isActive,
                startDate: startDate ? new Date(startDate) : notice.startDate,
                endDate: endDate ? new Date(endDate) : notice.endDate,
                remarks: remarks !== undefined ? remarks : notice.remarks
            }
        })

        if (!result) {
            throw new AppError("Failed to update notice", 500)
        }

        return result
    } catch (error) {
        console.log('Error in updateNoticeBoard', error)
        if (error instanceof AppError) throw error
        throw new AppError(error.message || 'Internal Server Error', error.statusCode || 500)
    }
}
