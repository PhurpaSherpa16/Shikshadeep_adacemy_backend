import AppError from "../../utils/appError.js"
import prisma from "../../utils/prisma.js"

export const getAllTeachers = async (req) => {
    try {
        let teachers = []
        const leaders = await prisma.faculty_member.findMany({
            where : {
                designation :{
                    in : ['director', 'principal', 'vice principal']
                }
            },
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
                designation: 'asc'
            }
        })

        teachers = [...leaders]

        if(leaders.length < 3){
            const remainingTeacher = 3 - leaders.length
            const otherTeachers = await prisma.faculty_member.findMany({
                where:{
                    designation:{
                        notIn: ['director', 'principal', 'vice principal']
                    }
                },
                select :{
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
                take: remainingTeacher,
                orderBy: {
                    experience: 'desc'
                }
            })
            teachers = [...teachers, ...otherTeachers]
        }

        return teachers

    } catch (error) {
        console.log('Error in getting teacher', error);
        if (error instanceof AppError) throw error
        throw new AppError(error.message || 'Internal Server Error', error.statusCode || 500)
    }
}