import AppError from "../../utils/appError.js"
import prisma from "../../utils/prisma.js"
import { supabase } from "../../utils/supabase.js"

export const updateJob = async (req) => {
    try {
        const { id } = req.params
        const { title, description, requirements, qualification, experience,
            jobType, salary, location, startDate, endDate, remarks, isActive } = req.body
        const files = req.files || {}

        if (!id) {
            throw new AppError("Job ID is required", 400)
        }

        const job = await prisma.job_vacancy.findUnique({
            where: { id }
        })

        if (!job) {
            throw new AppError("Job vacancy not found", 404)
        }

        let documentUrl = job.document_url || null
        // trigger that remove document
        const removeDocument = req.body.removeDocument === "true"
        if (removeDocument && job.document_url) {
            const oldDocName = decodeURIComponent(`job-document/${job.document_url.split('/').pop()}`)
            const { error: docError } = await supabase.storage.from('files').remove([oldDocName])
            if (docError) throw new AppError(`Document delete failed`, 400)
            documentUrl = null
        }

        if (!removeDocument) {
            // Handle document
            const file = files.document_url?.[0] || null
            if (!file) {
                throw new AppError("Document is required", 400)
            }
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
            const docName = decodeURIComponent(`/job-document/Job-Doc-${uniqueSuffix}-${file.originalname}`)

            const { error: docError } = await supabase.storage.from('files').upload(docName, file.buffer, { contentType: file.mimetype })
            if (docError) throw new AppError(`Document upload failed`, 400)
            documentUrl = supabase.storage.from('files').getPublicUrl(docName).data.publicUrl

            // Delete old document
            if (job.document_url) {
                const oldDocName = decodeURIComponent(`job-document/${job.document_url.split('/').pop()}`)
                await supabase.storage.from('files').remove([oldDocName])
            }
        }

        const result = await prisma.job_vacancy.update({
            where: { id },
            data: {
                title: title || job.title,
                description: description || job.description,
                requirements: requirements !== undefined ? requirements : job.requirements,
                qualification: qualification !== undefined ? qualification : job.qualification,
                experience: experience !== undefined ? experience : job.experience,
                jobType: jobType !== undefined ? jobType : job.jobType,
                salary: salary !== undefined ? salary : job.salary,
                location: location !== undefined ? location : job.location,
                startDate: startDate ? new Date(startDate) : job.startDate,
                endDate: endDate ? new Date(endDate) : job.endDate,
                remarks: remarks !== undefined ? remarks : job.remarks,
                isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : job.isActive,
                document_url: documentUrl
            }
        })

        if (!result) {
            const { error: imageError } = await supabase.storage.from('files').remove([docName])
            if (imageError) {
                console.log('Image deleting error', imageError);
            }
            throw new AppError("Failed to update job", 500)
        }

        return result
    } catch (error) {
        console.log('Error in updateJob', error)
        if (error instanceof AppError) throw error
        throw new AppError(error.message || 'Internal Server Error', error.statusCode || 500)
    }
}
