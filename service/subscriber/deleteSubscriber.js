import AppError from "../../utils/appError.js"
import prisma from "../../utils/prisma.js"

export const deleteSubscriber = async (req) =>{
    try {
        const {id} = req.params
        if(!id){
            throw new AppError('Id is required')
        }
        // post subscriber
        const result = await prisma.subscriber.delete({where: {id}})
        if(!result) throw new AppError('Subscriber not found', 404)
        return result

    } catch (error) {
        console.log('Error in deleteSubscriber service', error)
        if(error.code === 'P2025') throw new AppError('Subscriber not found', 404)
        // operational error
        if(error instanceof AppError) throw error
        // programming error
        throw new AppError('Failed to delete subscriber.', 500)
    }
}