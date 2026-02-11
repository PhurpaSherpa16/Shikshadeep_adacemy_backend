import AppError from "../../utils/appError.js"
import prisma from "../../utils/prisma.js"
import { supabase } from "../../utils/supabase.js"

export const createJob = async (req) => {
    try {
        const { title, description, requirements, qualification, experience, jobType, salary, location, startDate, endDate, remarks, isActive } = req.body
        const files = req.files

        if (!title || !description) {
            throw new AppError("Title and description are required", 400)
        }

        let documentUrl = null
        let docName = null

        // Upload document
        if (files && files.document_url) {
            const file = files.document_url[0]
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
            docName = decodeURIComponent(`job-document/Job-Doc-${uniqueSuffix}-${file.originalname}`)
            const { error: docError } = await supabase.storage.from('files').upload(docName, file.buffer, { contentType: file.mimetype })
            if (docError) throw new AppError(`Document upload failed`, 400)
            documentUrl = supabase.storage.from('files').getPublicUrl(docName).data.publicUrl
        }

        try {
            const result = await prisma.job_vacancy.create({
                data: {
                    title: title.toLowerCase() || null,
                    description: description.toLowerCase() || null,
                    requirements: requirements.toLowerCase() || null,
                    qualification: qualification.toLowerCase() || null,
                    experience: experience.toLowerCase() || null,
                    jobType: jobType.toLowerCase() || null,
                    salary: salary.toLowerCase() || null,
                    location: location.toLowerCase() || null,
                    startDate: startDate ? new Date(startDate) : null,
                    endDate: endDate ? new Date(endDate) : null,
                    remarks: remarks.toLowerCase() || null,
                    isActive: isActive === 'true' || isActive === true,
                    document_url: documentUrl,
                }
            })
            return result
        } catch (error) {
            console.log('Error in createJob', error)

            // rollback: delete newly uploaded file if DB operation fails
            if (docName) {
                const { error: imageError } = await supabase.storage.from('files').remove([docName])
                if (imageError) {
                    console.log('Image deleting error on rollback:', imageError);
                }
            }

            // job duplicate error
            if (error.code === 'P2002') {
                throw new AppError("Job already exists", 400)
            }
            
            throw new AppError("Failed to create job", 500)
        }

    } catch (error) {
        console.log('Error in createJob', error)
        if (error instanceof AppError) throw error
        throw new AppError(error.message || 'Internal Server Error', error.statusCode || 500)
    }
}
