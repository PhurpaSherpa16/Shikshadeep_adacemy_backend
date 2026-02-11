import AppError from "../../utils/appError.js"
import prisma from "../../utils/prisma.js"
import { supabase } from "../../utils/supabase.js"

export const deleteTeacher = async (req) => {
    try {
        const { id } = req.params
        if (!id) {
            throw new AppError("Teacher id is required", 400)
        }
        const teacher = await prisma.faculty_member.findUnique({
            where: { id },
        })
        if (!teacher) {
            throw new AppError("Teacher not found", 404)
        }
        const { error: deleteError } = await supabase.storage.from('school').remove([`teacher/${teacher.image_url.split('/').pop()}`])
        if (deleteError) {
            console.log('Error deleting old images from storage:', deleteError)
            throw new AppError("Failed to delete image.", 500)
        }
        const deletedTeacher = await prisma.faculty_member.delete({
            where: { id },
        })
        if (!deletedTeacher) {
            throw new AppError("Failed to delete teacher", 500)
        }
        return deletedTeacher
    } catch (error) {
        console.log('Error in deleting teacher', error);
        if (error instanceof AppError) throw error
        throw new AppError(error.message || 'Internal Server Error', error.statusCode || 500)
    }
}