import AppError from "../../utils/appError.js"
import prisma from "../../utils/prisma.js"
import sharp from "sharp"
import { supabase } from "../../utils/supabase.js"

export const updateTeacher = async (req) => {
    try {
        const { id } = req.params
        const { name, designation, quotes, experience, qualification, isActive, tag } = req.body
        const file = req.file
        // check if id is valid
        if (!id) {
            throw new AppError("Teacher id is required", 400)
        }

        // check if teacher exists
        const teacher = await prisma.faculty_member.findUnique({
            where: { id },
        })

        if (!teacher) {
            throw new AppError("Teacher not found", 404)
        }

        // image upload
        let imageUrl = teacher.image_url
        let newImageName
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`

        if (file) {
            newImageName = decodeURIComponent(`teacher/Teacher-${uniqueSuffix}-${file.originalname}`)
            const thumbBuffer = await sharp(file.buffer).resize(300, 200).toBuffer()
            const { error: imageError } = await supabase.storage.from('school').upload(newImageName, thumbBuffer, { contentType: file.mimetype })
            if (imageError) {
                console.log('Image uploading error', imageError);
                throw new AppError(`Image upload failed, please try again later`, 400)
            }
            imageUrl = supabase.storage.from('school').getPublicUrl(newImageName).data.publicUrl
        }

        // Tag update
        let updatedTeacherTagId = teacher.teacherTagId_fk
        if (tag) {
            let tempTag = await prisma.teacher_tag.findUnique({ where: { name: tag.toLowerCase() } })
            if (!tempTag) {
                tempTag = await prisma.teacher_tag.create({
                    data: {
                        name: tag.toLowerCase()
                    }
                })
            }
            updatedTeacherTagId = tempTag.id
        }

        // update teacher
        let updatedTeacher
        try {
            updatedTeacher = await prisma.faculty_member.update({
                where: { id },
                data: {
                    name: name.toLowerCase(),
                    designation: designation.toLowerCase(),
                    quotes: quotes.toLowerCase(),
                    experience: experience.toLowerCase(),
                    qualification: qualification.toLowerCase(),
                    isActive: isActive === 'true',
                    teacherTagId_fk: updatedTeacherTagId,
                    image_url: imageUrl || null
                }
            })
        } catch (error) {
            // rollback: delete newly uploaded images if DB update fails
            if (file) {
                await supabase.storage.from('school').remove([newImageName])
            }
            console.log('Database update error:', error);
            throw new AppError("Failed to update teacher, please try again later", 500);
        }

        // if update success and new file was uploaded, delete old images
        if (file) {
            const oldImageName = decodeURIComponent(`teacher/${teacher.image_url.split('/').pop()}`)
            const { error: deleteError } = await supabase.storage.from('school').remove([oldImageName])
            if (deleteError) {
                console.log('Error deleting old images from storage:', deleteError);
            }
        }

        return updatedTeacher

    } catch (error) {
        console.log('Error in updating teacher', error);
        if (error instanceof AppError) throw error
        throw new AppError(error.message || 'Internal Server Error', error.statusCode || 500)
    }
}