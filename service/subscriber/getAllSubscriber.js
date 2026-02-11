import AppError from "../../utils/appError.js"
import { pagination } from "../../utils/pagination.js"
import prisma from "../../utils/prisma.js"

export const getAllSubscriber = async (req) =>{
    try {
        const {limit, page, start} = pagination(req, 5, 10)
        // get total subscriber
        const totalSubscriber = await prisma.subscriber.count()

        const totalPages = Math.ceil(totalSubscriber / limit)
        
        // get all subscriber
        const result = await prisma.subscriber.findMany({
            select: {
                id: true,
                email: true,
                updatedAt: true
            },
            orderBy: {createdAt: 'desc'},
            take: limit,
            skip: start
        })
        return {
            totalSubscriber,
            totalPages,
            currentPage: page,
            limit,
            result
        }
    } catch (error) {
        console.log('Error in getAllSubscriber service', error)
        // operational error
        if(error instanceof AppError) throw error
        // programming error
        throw new AppError('Failed to get all subscriber.', 500)
    }
}