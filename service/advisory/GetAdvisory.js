import AppError from "../../utils/appError.js"
import prisma from "../../utils/prisma.js"

export const getAdvisory = async (req) => {
    try {
        const advisory = await prisma.school_advisory_council.findMany({
            select: {
                id: true,
                name: true,
                designation: true,
                quotes: true,
                image_url: true,
                isActive: true
            }
        })
        return advisory
    } catch (error) {
        console.log('Error in getting advisory', error)
        if (error.code === 'P2025') {
            throw new AppError("No advisory found", 404)
        }
        throw new AppError(error.message || 'Internal Server Error', error.statusCode || 500)
    }
}