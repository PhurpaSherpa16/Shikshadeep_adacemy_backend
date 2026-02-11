import AppError from "../../utils/appError.js"
import prisma from "../../utils/prisma.js"

export const getSchoolDetails = async() =>{
    try {
        const result = await prisma.school_contact_details.findMany({
            select : {
                id : true,
                school_primary_phone : true,
                school_secondary_phone : true,
                school_admission_email : true,
                school_general_email : true,
            }
        })

        if(result.length === 0){
            throw new AppError('No school details found', 404)
        }

        return result
    } catch (error) {
        console.log('Database error : ', error);
        if(error instanceof AppError){
            throw error
        }
        throw new AppError(`Error on fetching school details, please try again later`, 500)
    }
}