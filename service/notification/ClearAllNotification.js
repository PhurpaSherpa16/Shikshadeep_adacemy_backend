import AppError from "../../utils/appError.js"
import prisma from "../../utils/prisma.js"

export const clearAllNotification = async () => {
    try {
        const result = await prisma.notification.deleteMany()

        if(result.count === 0){
            return result
        }
        if(!result){
            console.log('Error on clearing all notification.', result);
            throw new AppError("Failed to clear all notification", 500)
        }
        return result
    } catch (error) {
        console.log('Error in clearing all notification: ', error)
        if(error instanceof AppError)throw error
        throw new AppError("Failed to clear all notification, please try again later.", 500)
    }
}