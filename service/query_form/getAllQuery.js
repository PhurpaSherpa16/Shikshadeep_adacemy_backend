import AppError from "../../utils/appError.js"
import prisma from "../../utils/prisma.js"

export const getAllQuery = async (req) => {
    try {
        const result = await prisma.query_form.findMany({
            select: {
                id: true,
                full_name: true,
                email: true,
                subject: true,
                createdAt: true
            }
        })
        return result
    } catch (error) {
        console.log(error);
        if (error instanceof AppError) throw error
        throw new AppError('Error getting all queries', 500)
    }
}