import AppError from "../../utils/appError.js"
import prisma from "../../utils/prisma.js"

export const getTeacher = async (req) => {
    try {
        const data = await prisma.faculty_member.findMany({
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
            },
            orderBy: {
                experience: 'desc'
            }
        })

        // this will group the data by tag and return an object
        const grouped = data.reduce((acc, item) => {
            const tag = item.teacherTag.name
            if (!acc[tag]) acc[tag] = []
            acc[tag].push(item)
            return acc
        }, {})


        if (!grouped) {
            throw new AppError("Failed to get teacher, please try again later", 500)
        }

        return grouped

    } catch (error) {
        console.log('Error in getting teacher', error);
        if (error instanceof AppError) throw error
        throw new AppError(error.message || 'Internal Server Error', error.statusCode || 500)
    }
}