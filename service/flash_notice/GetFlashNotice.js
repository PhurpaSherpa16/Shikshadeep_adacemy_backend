import AppError from "../../utils/appError.js"
import prisma from "../../utils/prisma.js"

export const getFlashNotice = async (req) => {
    try {
        const result = await prisma.school_flash_notice.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        })

        return result
    } catch (error) {
        console.log('Error in getFlashNotice', error)
        throw new AppError(error.message || 'Internal Server Error', error.statusCode || 500)
    }
}
