import AppError from "../../utils/appError.js";
import prisma from "../../utils/prisma.js";

export const getSingleTeacher = async (req) => {
    try {
        const { id } = req.params
        if (!id) throw new AppError('Teacher ID is missing', 400)

        const teacher = await prisma.faculty_member.findUnique({where: {id},
        select: {
                id: true,
                name: true,
                designation: true,
                quotes: true,
                isActive: true,
                experience: true,
                qualification: true,
                image_url: true,
                teacherTag: { select: { name: true } }
            }})
        if (!teacher) throw new AppError('Teacher not found', 404)

        return teacher

    } catch (error) {
        console.log('Error in getSingleTeacher:', error)
        if (error instanceof AppError) throw error
        throw new AppError('Fetching teacher failed, please try again later', 500)
    }
};