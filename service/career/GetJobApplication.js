import AppError  from "../../utils/appError.js"
import prisma from "../../utils/prisma.js"

export const getJobApplication = async (req) => {
    try {
        const { id } = req.params
        if(!id) throw new AppError('Job application ID is required', 400)

        const result = await prisma.job_application.findUnique({
            where: {
                id: id
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                resume_url: true,
                cover_letter: true,
                createdAt: true,
                job_vacancy: {
                    select: {
                        id: true,
                        title: true,
                    }
                }
            }
        })
        if (!result) throw new AppError('Job application not found', 404)
        return result

    } catch (error) {
        console.log('Error in getJobApplication', error)
        if (error instanceof AppError) throw error
        throw new AppError('Failed to get job application.', 500)
    }
}