import AppError from "../../utils/appError.js"
import prisma from "../../utils/prisma.js"

export const getJobs = async (req) => {
    try {
        const result = await prisma.job_vacancy.findMany({
            select: {
                id: true,
                title: true,
                description: true,
                requirements: true,
                qualification: true,
                experience: true,
                jobType: true,
                location: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        if(!result){
            console.log('Jobs not found.', result)
            throw new AppError("Jobs not found.", 404)
        }

        return result
    } catch (error) {
        console.log('Error in getJobs', error)
        if(error instanceof AppError)throw error
        throw new AppError("Failed to fetch jobs, please try again later.", 500)
    }
}
