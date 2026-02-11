import AppError from "../../utils/appError.js"
import prisma from "../../utils/prisma.js"

export const deleteNotification = async (req) => {
    try {
        const { id } = req.params

        if(!id) throw new AppError("Notification ID is required", 400)

        try {
            const result = await prisma.notification.delete({where: {id}})
        } catch (error) {
            // P2025 is for record not found
            if(error.code === 'P2025')throw new AppError("Notification not found", 404)
            console.log('error on deleting notification: ', error);
            throw new AppError("Failed to delete notification, please try again later.", 500)
        }

        return result
    } catch (error) {
        console.log('Error in deleting notification: ', error)
        if(error instanceof AppError)throw error
        throw new AppError("Failed to delete notification, please try again later.", 500)
    }
}