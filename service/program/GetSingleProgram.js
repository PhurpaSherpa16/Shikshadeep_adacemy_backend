import AppError from "../../utils/appError.js";
import prisma from "../../utils/prisma.js";

export const getSingleProgram = async (req) => {
    try {
        const { id } = req.params
        if (!id) {
            throw new AppError("Program ID is missing.", 400)
        }

        const program = await prisma.program.findUnique({
            where: { id },
            select: {
                id: true,
                title: true,
                grade: true,
                description: true,
                image_url: true,
                displayOrder: true,
                features: {
                    select: {
                        title: true
                    }
                }
            },
        })

        if (!program) {
            throw new AppError("Program not found", 404)
        }

        return program

    } catch (error) {
        console.error("Error in getSingleProgram:", error)
        if (error instanceof AppError) throw error
        throw new AppError(error.message || "Failed to fetch program", 500)
    }
}
