import AppError from "../../utils/appError.js"
import prisma from "../../utils/prisma.js"

export async function patchQuery(req){
    try {
        const { id } = req.params
        if(!id) throw new AppError('Query ID is required', 400)

        const result = await prisma.query_form.update({
            where: {id}, data: {is_open: true}
        })
        if(!result) throw new AppError('Failed to update query, please try again later.', 500)

        return result
    } catch (error) {
        console.log('Error in updating query: ', error);
        if(error instanceof AppError)throw error
        throw new AppError('Failed to update query, please try again later.', 500)
    }
}

