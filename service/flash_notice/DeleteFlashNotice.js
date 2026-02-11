import AppError from "../../utils/appError.js"
import prisma from "../../utils/prisma.js"
import { supabase } from "../../utils/supabase.js"

export const deleteFlashNotice = async (req) => {
    try {
        const { id } = req.params

        if (!id) {
            throw new AppError("Flash notice ID is required", 400)
        }

        const flashNotice = await prisma.school_flash_notice.findUnique({
            where: { id }
        })

        if (!flashNotice) {
            throw new AppError("Flash notice not found", 404)
        }

        if (flashNotice.image_url) {
            const imageName = `flash-notice/${flashNotice.image_url.split('/').pop()}`
            const { error: imageError } = await supabase.storage.from('school').remove([imageName])
            if (imageError) {
                console.log('Image deleting error', imageError);
            }
        }

        const result = await prisma.school_flash_notice.delete({
            where: { id }
        })

        if (!result) {

            throw new AppError("Failed to delete flash notice", 500)
        }

        return result
    } catch (error) {
        console.log('Error in deleteFlashNotice', error)
        if (error instanceof AppError) throw error
        throw new AppError(error.message || 'Internal Server Error', error.statusCode || 500)
    }
}
