import AppError from "../../utils/appError.js";
import prisma from "../../utils/prisma.js";

export async function updateStudentApplication(req){
    try {
        const {id} = req.params

        const result = await prisma.student_application.update({
            where: {id},
            data: {is_open: true}
        })
        if(!result) throw new AppError("Failed to update student application, please try again later.", 500)
        return result
    } catch (error) {
        console.log('Error in updating student application: ', error);
        if(error instanceof AppError)throw error
        throw new AppError("Failed to update student application, please try again later.", 500)
    }
}
