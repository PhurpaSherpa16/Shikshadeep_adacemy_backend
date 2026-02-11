import AppError from "../../utils/appError.js"
import prisma from "../../utils/prisma.js"
import { supabase } from "../../utils/supabase.js"
import sharp from "sharp"

export const createAdvisory = async (req) => {
    try {
        const { name, designation, quotes, isActive } = req.body

        const file = req.file

        if (!file) {
            throw new AppError('Image is required', 400)
        }

        if (!name || !quotes) {
            throw new AppError('All fields are required', 400)
        }

        // image upload
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
        const imageName = `Advisory-${uniqueSuffix}-${file.originalname}`
        const thumbBuffer = await sharp(file.buffer).resize(300, 200).toBuffer()
        const { error: imageError } = await supabase.storage.from('school').upload(imageName, thumbBuffer, { contentType: file.mimetype })
        if (imageError) {
            console.log('Image uploading error', imageError);
            throw new AppError(`Image upload failed, please try again later`, 400)
        }
        const imageUrl = supabase.storage.from('school').getPublicUrl(imageName).data.publicUrl

        // post to database
        let tempAdvisory
        try {
            tempAdvisory = await prisma.school_advisory_council.create({
                data: {
                    name: name.toLowerCase(),
                    designation: designation.toLowerCase() || null,
                    quotes: quotes.toLowerCase(),
                    image_url: imageUrl || null,
                    isActive: isActive === 'true'
                }
            })
        } catch (error) {
            // delete image if advisory creation fails - rollback
            console.log('Database error:', error)
            await supabase.storage.from('school').remove([imageName])
            if(error.code === 'P2002'){
                throw new AppError('Advisory already exists', 400)
            }
            throw new AppError("Failed to create advisory entry, please try again later", 500);
        }
        return tempAdvisory
    } catch (error) {
        console.log('Error in creating advisory', error)
        if (error instanceof AppError) throw error
        throw new AppError(error.message || 'Internal Server Error', error.statusCode || 500)
    }
}