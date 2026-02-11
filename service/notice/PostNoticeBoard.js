import AppError from "../../utils/appError.js"
import prisma from "../../utils/prisma.js"

export const createNoticeBoard = async (req) => {
    try {
        const { title, content, isActive, startDate, endDate, remarks } = req.body

        if (!title) {
            throw new AppError("Title is required", 400)
        }

        const result = await prisma.school_notice_board.create({
            data: {
                title,
                content: content || null,
                isActive: isActive === 'true' || isActive === true,
                startDate: startDate ? new Date(startDate) : null,
                endDate: endDate ? new Date(endDate) : null,
                remarks: remarks || null
            }
        })

        if (!result) {
            throw new AppError("Failed to create notice", 500)
        }

        return result
    } catch (error) {
        console.log('Error in createNoticeBoard', error)
        if (error instanceof AppError) throw error
        throw new AppError(error.message || 'Internal Server Error', error.statusCode || 500)
    }
}
