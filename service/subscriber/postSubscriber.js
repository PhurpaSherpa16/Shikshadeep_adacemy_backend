import AppError from "../../utils/appError.js"
import prisma from "../../utils/prisma.js"

export const postSubscriber = async (req) =>{
    try {
        const {email} = req.body
        if(!email){
            throw new AppError('Email is required')
        }
        // post subscriber
        const result = await prisma.subscriber.create({data: {email}})

        return result

    } catch (error) {
        console.log('Error in postSubscriber service', error)
        // operational error
        if(error.code === 'P2002') throw new AppError('Email already exists', 400)
        if(error instanceof AppError) throw error
        // programming error
        throw new AppError('Failed to create subscriber.', 500)
    }
}