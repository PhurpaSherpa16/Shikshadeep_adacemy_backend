import AppError from "../../utils/appError.js"
import prisma from "../../utils/prisma.js"

export const getSingleJob = async (req) => {
    try {
        const { id } = req.params

        if (!id) {
            throw new AppError("Job ID is required", 400)
        }

        const job = await prisma.job_vacancy.findUnique({
            where: { id }
        })

        if (!job) {
            throw new AppError("Job vacancy not found", 404)
        }

        return job
    } catch (error) {
        console.log('Error in getSingleJob', error)
        if (error instanceof AppError) throw error
        throw new AppError(error.message || 'Internal Server Error', error.statusCode || 500)
    }
}