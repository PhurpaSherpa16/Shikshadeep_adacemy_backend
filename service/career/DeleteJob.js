import AppError from "../../utils/appError.js"
import prisma from "../../utils/prisma.js"
import { supabase } from "../../utils/supabase.js"

export const deleteJob = async (req) => {
    try {
        const { id } = req.params

        if (!id) {
            throw new AppError("Job ID is required", 400)
        }

        const job = await prisma.job_vacancy.findUnique({
            where: { id }
        })

        if (!job) {
            throw new AppError("Job vacancy not found", 404)
        }

        let document_url = job.document_url
        // delete document
        if (document_url) {
            const fileName = document_url.split("/").pop()
            const docName = decodeURIComponent(`job-document/${fileName}`)
            const { error: imageError } = await supabase.storage.from('files').remove([docName])
            if (imageError) {
                console.log('Image deleting error', imageError)
            }
        }

        const result = await prisma.job_vacancy.delete({
            where: { id }
        })

        if (!result) {
            throw new AppError("Job vacancy not deleted. Please try again.", 500)
        }

        return result
    } catch (error) {
        console.log('Error in deleteJob', error)
        if (error instanceof AppError) throw error
        throw new AppError(error.message || 'Internal Server Error', error.statusCode || 500)
    }
}
