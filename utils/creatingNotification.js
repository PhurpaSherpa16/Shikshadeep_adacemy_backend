import { PrismaClient } from "@prisma/client"
import AppError from "./appError.js"

const prisma = new PrismaClient()

export const creatingNotification = async (title, content, type, entity_id, entity, ) => {
    try {
        const notification = await prisma.notification.create({
            data: {
                title,
                content,
                type,
                entity_id,
                entity,
                isActive: true,
            }
        })
        if(!notification){
            throw new AppError("Failed to create notification", 500)
        }
        return notification
    } catch (error) {
        console.log('Error in creating notification', error)
        if(error instanceof AppError) throw error
        throw new AppError(error.message || 'Internal Server Error', error.statusCode || 500)
    }
}


