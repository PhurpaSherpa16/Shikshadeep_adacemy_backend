import AppError from "../../utils/appError.js"
import { pagination } from "../../utils/pagination.js"
import prisma from "../../utils/prisma.js"

export const getAllQuery = async (req) => {
    try {
        const {limit, page, start, end} = pagination(req, 10, 50)
        const total_items = await prisma.query_form.count()
        const total_pages = Math.ceil(total_items / limit)
        const result = await prisma.query_form.findMany({
            select: {
                id: true,
                full_name: true,
                email: true,
                subject: true,
                phone: true,
                createdAt: true,
                is_open: true
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: limit,
            skip: start
        })
        return {
            total_items,
            total_pages,
            current_page_number: page,
            limit_items: limit,
            data: result
        }
    } catch (error) {
        console.log(error);
        if (error instanceof AppError) throw error
        throw new AppError('Error getting all queries', 500)
    }
}