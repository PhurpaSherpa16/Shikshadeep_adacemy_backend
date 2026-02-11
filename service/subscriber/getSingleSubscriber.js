import AppError from "../../utils/appError.js"
import prisma from "../../utils/prisma.js"

export const getSingleSubscriber = async (req) =>{
    try {
        const {id} = req.params
        if(!id){
            throw new AppError('Id is required')
        }
        // post subscriber
        const result = await prisma.subscriber.findUnique({where: {id}})
        if(!result) throw new AppError('Subscriber not found', 404)
        return result

    } catch (error) {
        console.log('Error in getSingleSubscriber service', error)
        // operational error
        if(error instanceof AppError) throw error
        // programming error
        throw new AppError('Failed to get single subscriber.', 500)
    }
}