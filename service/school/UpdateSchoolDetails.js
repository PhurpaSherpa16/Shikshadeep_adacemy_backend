import AppError from "../../utils/appError.js"
import prisma from "../../utils/prisma.js"

export const updateSchoolDetails = async (req) => {
    try {
        const { id } = req.params

        if (!id) {
            throw new AppError('School id is required', 400)
        }

        // checking id is valid or not
        const isIdValid = await prisma.school_contact_details.findUnique({
            where: {
                id: id
            }
        })

        if (!isIdValid) {
            throw new AppError('Invalid school id', 404)
        }

        const { school_primary_phone, school_secondary_phone, school_admission_email, school_general_email } = req.body

        if (!school_primary_phone || !school_secondary_phone || !school_admission_email || !school_general_email) {
            throw new AppError('All fields are required', 400)
        }

        const result = await prisma.school_contact_details.update({
            where: {
                id: id
            },
            data: {
                school_primary_phone,
                school_secondary_phone,
                school_admission_email,
                school_general_email
            }
        })

        if (!result) {
            throw new AppError('No school details found', 404)
        }

        return result

    } catch (error) {
        console.log('Database error : ', error);
        if (error instanceof AppError) {
            throw error
        }
        throw new AppError(`Error on updating school details, please try again later`, 500)
    }
}