import AppError from "../../utils/appError.js"
import { pagination } from "../../utils/pagination.js"
import prisma from "../../utils/prisma.js"

export const getVacancyAnnouncement = async (req) => {
    try {
        const { limit, page, start } = pagination(req, 9, 50)

        const [result, total_items] = await Promise.all([
            prisma.job_vacancy.findMany({
            select: {
                id: true,
                title: true,
                description: true,
                requirements: true,
                qualification: true,
                experience: true,
                jobType: true,
                location: true,
                salary: true,
                endDate : true,
                isActive: true,
                createdAt: true,
                no_of_applicants: true,
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: limit,
            skip: start
        }),
        prisma.job_vacancy.count()
        ])
        if(!result){
            console.log('Vacancy announcement not found.', result)
            throw new AppError("Vacancy announcement not found.", 404)
        }

        return {
            total_items,
            total_pages: Math.ceil(total_items / limit),
            current_page_number: page,
            limit_items: limit,
            result
        }
    } catch (error) {
        console.log('Error in getVacancyAnnouncement', error)
        if(error instanceof AppError)throw error
        throw new AppError("Failed to fetch vacancy announcement, please try again later.", 500)
    }
}
