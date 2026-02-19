import AppError from "../../utils/appError.js"
import { pagination } from "../../utils/pagination.js"
import prisma from "../../utils/prisma.js"


export const getJobByIdAndCorrespondingApplicants = async (req) => {
    try {
        const {limit, page, start} = pagination(req, 10, 50)
        const {id} = req.params
        if(!id) throw new AppError("Job id is required", 400)

        const job = await prisma.job_vacancy.findUnique(
            {where: { id },
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
                isActive: true,
                createdAt: true,
                startDate: true,
                endDate: true,
                no_of_applicants: true, 
                document_url: true,
                _count: {
                    select: {
                        jobApplications: true
                    }
                },
                jobApplications: {
                    orderBy: {
                        createdAt: 'asc'
                    },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        resume_url: true,
                        cover_letter: true,
                        createdAt: true
                    },
                    take: limit,
                    skip: start
                }
            }
        })
        const total_items = job._count.jobApplications
        const total_pages = Math.ceil(job._count.jobApplications / limit)
        const current_page_number = page
        const limit_items = limit
        let applicants = job.jobApplications || []

        return {
            total_items,
            total_pages,
            current_page_number,
            limit_items,
            job: {id: job.id,
                title: job.title,
                description: job.description,
                requirements: job.requirements,
                qualification: job.qualification,
                experience: job.experience,
                jobType: job.jobType,
                location: job.location,
                salary: job.salary,
                isActive: job.isActive,
                startDate: job.startDate,
                endDate: job.endDate,
                createdAt: job.createdAt,
                document_url: job.document_url,
                no_of_applicants: job.no_of_applicants,
                _count: job._count,
            },
            applicants,
        }
    } catch (error) {
        console.log('Error in getJobByIdAndCorrespondingApplicants', error)
        if (error instanceof AppError) throw error
        throw new AppError(error.message || 'Internal Server Error', error.statusCode || 500)
    }
}