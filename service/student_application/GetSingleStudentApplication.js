import AppError from "../../utils/appError.js"
import prisma from "../../utils/prisma.js"

export const getSingleStudentApplication = async (req) => {
    try {
        const {id} = req.params
        if(!id) throw new AppError("Invalid id, please try again.", 400)

        // fetch the application
        const result = await prisma.student_application.findUnique({
            where: {id},
            select: {
                id: true,
                full_name: true,
                father_name: true,
                mother_name: true,
                contact_no: true,
                address: true,
                previous_school_name: true,
                academic_results: true,
                current_grade: true,
                remarks: true,
                createdAt: true,
                is_open: true
            }
        })
        if(!result) throw new AppError("Application not found.", 404)
        return result
    } catch (error) {
        console.log('Error in fetching single admission application: ', error)
        if(error instanceof AppError)throw error
        throw new AppError("Failed to fetch single admission application, please try again later.", 500)
    }
}