import AppError from "../../utils/appError.js"
import prisma from "../../utils/prisma.js"
import { supabase } from "../../utils/supabase.js"
import sharp from "sharp"

export const createTeacher = async (req) => {
    let imageName = null
    try {
        const { name, designation, quotes, isActive, experience, qualification, tag: tagName } = req.body
        const file = req.file

        // Validation
        if (!file) {
            throw new AppError("Image is required", 400)
        }
        if (!name || !tagName) {
            throw new AppError("Name and tag are required", 400)
        }

        // 1. Tag processing (Upsert for efficiency)
        const tag = await prisma.teacher_tag.upsert({
            where: { name: tagName.toLowerCase() },
            update: {},
            create: { name: tagName.toLowerCase() }
        })

        // 2. Image processing and upload
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
        imageName = `teacher/Teacher-${uniqueSuffix}-${file.originalname}`

        const imageBuffer = await sharp(file.buffer).resize(300, 200).toBuffer()
        const { error: imageError } = await supabase.storage.from('school').upload(imageName, imageBuffer, {
            contentType: file.mimetype
        })

        if (imageError) {
            console.error('Image uploading error in createTeacher:', imageError)
            throw new AppError("Image upload failed", 400)
        }

        const imageUrl = supabase.storage.from('school/teacher').getPublicUrl(imageName).data.publicUrl

        // 3. Database Entry
        try {
            const result = await prisma.faculty_member.create({
                data: {
                    name: name.toLowerCase(),
                    designation: designation?.toLowerCase() || null,
                    quotes: quotes?.toLowerCase() || null,
                    isActive: isActive === 'true' || isActive === true,
                    experience: experience?.toLowerCase() || null,
                    qualification: qualification?.toLowerCase() || null,
                    image_url: imageUrl,
                    teacherTagId_fk: tag.id
                }
            })
            return result

        } catch (error) {
            console.error('Database error in createTeacher:', error)
            // Robust Rollback: Always cleanup storage if a DB insertion fails
            console.log(imageName)
            const imageDelete = await supabase.storage.from('school').remove([imageName])
                .catch(err => console.error("Rollback cleanup failed in createTeacher:", err))
            if (!imageDelete.error) console.log('Image deleted successfully from storage')

            // duplicate entry error
            if (error.code === 'P2002') {
                throw new AppError("This teacher already exists", 400)
            }

            throw new AppError("Failed to create teacher, please try again later", 500)
        }

    } catch (error) {
        console.error('Error in createTeacher:', error)
        if (error instanceof AppError) throw error
        throw new AppError(error.message || 'Internal Server Error', 500)
    }
}