import { supabase } from '../../utils/supabase.js';
import AppError from "../../utils/appError.js";
import prisma from "../../utils/prisma.js";

export const deleteProgram = async (req) => {
    try {
        const { id } = req.params
        if (!id) {
            throw new AppError("Program ID is required", 400)
        }

        const existingProgram = await prisma.program.findUnique({
            where: { id }
        })

        if (!existingProgram) {
            throw new AppError("Program not found", 404)
        }

        const imageName = existingProgram.image_url.split('/').pop()

        // Delete from database (cascades to features)
        await prisma.program.delete({
            where: { id }
        })

        // Delete from Supabase
        const { error: deleteError } = await supabase.storage
            .from('program_images')
            .remove([imageName])

        if (deleteError) {
            console.error('Delete failed for program image:', deleteError)
            // We don't throw here because DB record is already gone
        }

        return { message: "Program deleted successfully" }

    } catch (error) {
        console.error("Error in deleteProgram:", error)
        if (error instanceof AppError) throw error
        throw new AppError("Failed to delete, please try again later.", 500)
    }
}
