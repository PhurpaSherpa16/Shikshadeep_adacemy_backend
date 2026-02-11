import AppError from "../../utils/appError.js";
import prisma from "../../utils/prisma.js";
import { supabase } from "../../utils/supabase.js";

export const deleteJobApplication = async (req) => {
    try {
        const { id } = req.params
        if(!id) throw new AppError('Job application ID is required', 400)

        const jobApplication = await prisma.job_application.findUnique({where: {id}})
        if (!jobApplication) throw new AppError('Job application not found', 404)

        let resume_url = jobApplication.resume_url

        // delete resume
        const resumeName = resume_url.split('/').pop()
        const docName = decodeURIComponent(`resume/${resumeName}`)
        const { error: imageError } = await supabase.storage.from('files').remove([docName])
        if (imageError) {
            console.log('Image deleting error', imageError)
        }

        const result = await prisma.job_application.delete({where: {id}})

        if (!result) throw new AppError('Job application not found', 404)

        return result
    } catch (error) {
        console.log('Error in deleteJobApplication', error)
        if (error instanceof AppError) throw error
        throw new AppError(error.message || 'Internal Server Error', error.statusCode || 500)
    }
}