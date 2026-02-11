import AppError from "../../utils/appError.js"
import prisma from "../../utils/prisma.js"

export const getAllNotification = async (req) => {
    try {
        const  result = await prisma.notification.findMany({
            select: {
                id: true,
                title: true,
                content: true,
                type: true,
                entity_id: true,
                createdAt: true,
                isActive: true,
            },
            orderBy: [{isActive: "desc"},{createdAt: "desc"}]
        })
        if(!result){
            throw new AppError("Failed to fetch notifications, please try again later.", 500)
        }
        return result

    } catch (error) {
        console.log('Error in fetching single admission application: ', error)
        if(error instanceof AppError)throw error
        throw new AppError("Failed to fetch single admission application, please try again later.", 500)
    }
}