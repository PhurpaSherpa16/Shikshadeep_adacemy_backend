import AppError from "../../utils/appError.js"
import prisma from "../../utils/prisma.js"

export const getProfile = async (req) => {
    try {
        const { id } = req.params
        if (!id) throw new AppError('User ID is required', 400)

        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                first_name: true,
                last_name: true,
                phone: true,
                avatar_url: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true
            }
        })

        if (!user) throw new AppError('User not found', 404)
        return user
    } catch (error) {
        if (error instanceof AppError) throw error
        throw new AppError('Failed to fetch profile', 500)
    }
}
