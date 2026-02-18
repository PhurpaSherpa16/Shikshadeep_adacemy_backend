import AppError from "../../utils/appError.js"
import { creatingNotification } from "../../utils/creatingNotification.js"
import prisma from "../../utils/prisma.js"
import { isPhone, isRequired, isString } from "../../utils/validators.js"

export const postStudentApplication = async (req) => {
    try {
        const { full_name, father_name, mother_name, contact_no, address, 
            previous_school_name, academic_results, current_grade, remarks} = req.body

        // validation check
        if(!isRequired(full_name) || !isRequired(father_name) 
            || !isRequired(mother_name) || !isRequired(contact_no) 
            || !isRequired(address) || !isRequired(previous_school_name) 
            || !isRequired(academic_results) || !isRequired(current_grade)){
            throw new AppError("All fields are required", 400)
        }

        if(!isPhone(contact_no)) throw new AppError("Invalid phone number, please try again.", 400)
        if(!isString(full_name) || !isString(father_name) || !isString(mother_name) || !isString(previous_school_name)){
            throw new AppError("full name Numbers are not allowed in some fields, please try again.", 400)
        }
        // submitting application
        let result = await prisma.student_application.create({
                data: {
                    full_name : full_name.trim().toLowerCase(),
                    father_name : father_name.trim().toLowerCase(),
                    mother_name : mother_name.trim().toLowerCase(),
                    contact_no : contact_no.trim(),
                    address : address.trim().toLowerCase(),
                    previous_school_name : previous_school_name.trim().toLowerCase(),
                    academic_results : academic_results.trim(),
                    current_grade : current_grade.trim(),
                    remarks : remarks.trim(),
                    is_open : false
        }})

        // creating notification
        if(result){
            await creatingNotification(
                "New Admission Application",
                full_name,
                "admission",
                result.id,
                "student_application",
                true)
            }

        if(!result) throw new AppError("Failed to submit new admission application, please try again later.", 500)

        return result
    } catch (error) {
        console.log('Error in submitting new admission application: ', error);
        if(error.code === 'P2002') throw new AppError("Application already exists, please try again.", 400)
        if (error instanceof AppError) throw error
        throw new AppError("Failed to submit new admission application, please try again later.", 500)
    }
}