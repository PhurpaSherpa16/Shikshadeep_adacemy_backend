import AppError from "../../utils/appError.js";
import { pagination } from "../../utils/pagination.js";
import prisma from "../../utils/prisma.js";

export const getAllStudentApplication = async (req) => {
    try {
        const {page, limit, skip} = pagination(req, 10, 50)
        const total = await prisma.student_application.count()
        if(!total) throw new AppError("No admission applications found.", 404)
        const result = await prisma.student_application.findMany({
            select: {
                id: true,
                full_name: true,
                contact_no: true,
                current_grade: true,
                academic_results: true,
                createdAt: true,
                is_open: true
            },
            skip,
            take: limit,
            orderBy: {createdAt: "desc"}
        })
        if(!result) throw new AppError("No, new admission applications found.", 404)
        return {
            total,
            total_pages: Math.ceil(total / limit),
            current_page_number: page,
            limit_items: limit,
            result
        }
    } catch (error) {
        console.log('Error in fetching all admission applications: ', error);
        if(error instanceof AppError)throw error
        throw new AppError("Failed to fetch all admission applications, please try again later.", 500)
    }
}