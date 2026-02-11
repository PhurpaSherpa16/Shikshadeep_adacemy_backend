import AppError from "../../utils/appError.js"
import prisma from "../../utils/prisma.js"
import { supabase } from "../../utils/supabase.js"

export const deleteAdvisory = async (req) => {
    try {
        const { id } = req.params

        if (!id) {
            throw new AppError('Advisory ID is required', 400)
        }

        const existingAdvisory = await prisma.school_advisory_council.findUnique({
            where: { id }
        })

        if (!existingAdvisory) {
            throw new AppError('Advisory not found', 404)
        }

        const result = await prisma.school_advisory_council.delete({
            where: { id }
        })

        // delete image from supabase
        const imageName = existingAdvisory.image_url.split('/').pop()
        const { error: imageError } = await supabase.storage.from('school').remove([imageName])
        if (imageError) {
            console.log('Image deleting error', imageError);
            throw new AppError(`Image delete failed, please try again later`, 400)
        }

        return result
    } catch (error) {
        console.log('Error in deleting advisory', error);
        throw new AppError(error.message || 'Internal Server Error', error.statusCode || 500)
    }
}