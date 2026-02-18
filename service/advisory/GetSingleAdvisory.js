import prisma from "../../utils/prisma.js"
import AppError from "../../utils/appError.js"

export const getSingleAdvisory = async (req) => {
    try {
        const advisory = await prisma.school_advisory_council.findUnique({
            where: {
                id: req.params.id
            },
            select: {
                id: true,
                name: true,
                designation: true,
                quotes: true,
                image_url: true,
                isActive: true
            }
        })

        if (!advisory) throw new AppError("No advisory found", 404)

        return advisory
    } catch (error) {
        console.log('Error in getting single advisory', error)
        if (error.code === 'P2025') throw new AppError("No advisory found", 404)
        if(error instanceof AppError) throw error
        throw new AppError(error.message || 'Internal Server Error', error.statusCode || 500)
    }
}