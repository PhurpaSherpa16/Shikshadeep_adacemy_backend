import AppError from "../../utils/appError.js"
import prisma from "../../utils/prisma.js"

export const getSingleNotification = async (req) => {
    try {
        const { id } = req.params
        if(!id) throw new AppError("Notification ID is required", 400)

        const [result, updatedNotification] = await Promise.all([
            prisma[notification.entity].findUnique({where: {id: notification.entity_id}}),
            prisma.notification.update({where: {id}, data: {isActive: false}})
        ])
        if(!result || !updatedNotification) throw new AppError("Notification not found", 404)

        return result
    } catch (error) {
        console.log('Error in fetching single notification: ', error)
        if(error instanceof AppError)throw error
        throw new AppError("Failed to fetch single notification, please try again later.", 500)
    }
    
}