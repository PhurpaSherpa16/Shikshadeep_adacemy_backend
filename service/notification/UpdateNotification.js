import AppError from "../../utils/appError.js"
import prisma from "../../utils/prisma.js"

export const updateNotification = async (req) => {
    try {
        const { id } = req.params

        if(!id) throw new AppError("Notification ID is required", 400)

        try {
            const result = await prisma.notification.update({
                where: { id },
                data: { isActive : false}
            })
        } catch (error) {
            console.log(error);
            if(error.code === 'P2025')throw new AppError("Notification not found", 404)
            throw new AppError("Failed to update notification, please try again later.", 500)
        }
        
        return result
    } catch (error) {
        console.log('Error in updating notification: ', error)
        if(error instanceof AppError)throw error
        throw new AppError("Failed to update notification, please try again later.", 500)
    }
}