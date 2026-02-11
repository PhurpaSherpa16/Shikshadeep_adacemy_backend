import AppError from "../../utils/appError.js"
import prisma from "../../utils/prisma.js"
import { supabase } from "../../utils/supabase.js"
import { creatingNotification } from "../../utils/creatingNotification.js"

export const submitJobApplication = async (req) => {
    try {
        const { id } = req.params
        const { name, email, phone, cover_letter } = req.body

        if (!name || !email || !phone || !cover_letter) {
            throw new AppError("All fields are required", 400)
        }

        let file = req.files?.document_url?.[0]

        if (!file) {
            throw new AppError("Resume/CV is required", 400)
        }

        // Upload resume
        let resumeUrl = null
        let resumeName = null
        try {
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
            resumeName = decodeURIComponent(`resume/Resume-${uniqueSuffix}-${file.originalname}`)
            const { error: uploadError } = await supabase.storage.from('files').upload(resumeName, file.buffer, { contentType: file.mimetype })
            if (uploadError) throw new AppError("Failed to upload resume", 400)
            resumeUrl = supabase.storage.from('files').getPublicUrl(resumeName).data.publicUrl

            const result = await prisma.job_application.create({
                data: {
                    name: name.toLowerCase(),
                    email,
                    phone,
                    cover_letter: cover_letter || null,
                    resume_url: resumeUrl,
                    job_vacancy_id_fk: id
                }
                })
            // creating notification
            if(result){
                await creatingNotification(
                    "New Job Application",
                    name,
                    "vacancy",
                    result.id,
                "job_application",
                true
            )}
            return result
        } catch (error) {
            console.log('Error in submitJobApplication', error)
            
            // Rollback if DB insert fails
            if(resumeName){
                const { error: deleteError } = await supabase.storage.from('files').remove([resumeName])
                if (deleteError) console.log("Failed to delete uploaded resume:", deleteError)
            }
        
            // Check if job application already exists
            if(error.code === 'P2002'){
                throw new AppError("Job application already exists.", 400)
            }
            
            throw new AppError("Failed to create job application", 500)            
        } 
    } catch (error) {
        console.log('Error in submitJobApplication', error)
        if (error instanceof AppError) throw error
        throw new AppError(error.message || 'Internal Server Error', error.statusCode || 500)
    }
}
