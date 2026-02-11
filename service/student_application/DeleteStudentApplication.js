import AppError from "../../utils/appError.js"
import prisma from "../../utils/prisma.js"

export const deleteStudentApplication = async (req) => {
    try {
        const {id} = req.params
        if(!id){
            throw new AppError("Invalid id, please try again.", 400)
        }
        // delete the application
        const result = await prisma.student_application.delete({
            where: {id}
        })

        if(!result) throw new AppError("Student Application not found.", 404)

        return result
    } catch (error) {
        console.log('Error in deleting student application: ', error)
        if(error instanceof AppError)throw error
        throw new AppError("Failed to delete student application, please try again later.", 500)
    }
}