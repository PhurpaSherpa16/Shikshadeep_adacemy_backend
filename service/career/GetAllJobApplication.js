import prisma from "../../utils/prisma.js"
import AppError from "../../utils/appError.js"

export const getAllJobApplication = async () => {
    try {
        const result = await prisma.job_application.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                createdAt: true,
                job_vacancy: {
                    select: {
                        id: true,
                        title: true,
                    }
                }
            }
        })
        if (!result) {
            throw new AppError("No job applications found.", 404)
        }
        return result
    } catch (error) {
        console.log('Error in getAllJobApplication', error)
        if (error instanceof AppError) throw error
        throw new AppError('Failed to get job applications.', 500)
    }
}