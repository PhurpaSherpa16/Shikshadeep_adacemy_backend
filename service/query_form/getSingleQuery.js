import AppError from "../../utils/appError.js"
import prisma from "../../utils/prisma.js"

export const getSingleQuery = async (req) => {
    try {
        const { id } = req.params
        if (!id) {
            throw new AppError('Query id is required', 400)
        }
        const result = await prisma.query_form.findUnique({
            where: { id }
        })
        if (!result) {
            throw new AppError('Query not found', 404)
        }
        return result
    } catch (error) {
        console.log(error)
        if (error instanceof AppError) throw error
        throw new AppError('Error getting query', 500)
    }
}