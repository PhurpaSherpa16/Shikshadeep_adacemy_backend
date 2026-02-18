import AppError from "../../utils/appError.js"
import prisma from "../../utils/prisma.js"
import { supabase } from "../../utils/supabase.js"
import sharp from "sharp"

export const updateAdvisory = async (req) => {
    try {
        const { id } = req.params
        const { name, designation, quotes, isActive, image_url } = req.body
        console.log(name, image_url)
        const file = req.file
        if (!id) {
            throw new AppError('Id is required', 400)
        }
        if (!name || !quotes) {
            throw new AppError('All fields are required', 400)
        }

        // check if advisory exists
        const existingAdvisory = await prisma.school_advisory_council.findUnique({ where: { id } })
        if (!existingAdvisory) {
            throw new AppError('Advisory not found', 404)
        }
        let imageUrl = existingAdvisory.image_url
        let newImageName
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`

        // image upload
        if (file) {
            newImageName = `advisory/Advisory-${uniqueSuffix}-${file.originalname}`
            const { error: imageError } = await supabase.storage.from('school').upload(newImageName, file.buffer, { contentType: file.mimetype })
            if (imageError) {
                console.log('Image uploading error', imageError);
                throw new AppError(`Image upload failed, please try again later`, 400)
            }
            imageUrl = supabase.storage.from('school').getPublicUrl(newImageName).data.publicUrl
        }

        // update advisory
        let updatedAdvisory
        try {
            updatedAdvisory = await prisma.school_advisory_council.update({
                where: { id },
                data: {
                    name: name.toLowerCase(),
                    designation: designation.toLowerCase() || null,
                    quotes: quotes.toLowerCase(),
                    image_url: imageUrl || null,
                    isActive: isActive === 'true'
                }
            })
        } catch (error) {
            // rollback: delete newly uploaded images if DB update fails
            if (file) {
                await supabase.storage.from('school').remove([newImageName])
            }
            console.log('Database update error:', error);
            throw new AppError("Failed to update advisory, please try again later", 500);
        }

        // if update success and new file was uploaded, delete old images
        if (file) {
            const oldImageName = existingAdvisory.image_url.split('/').pop()
            const { error: deleteError } = await supabase.storage.from('school').remove([oldImageName])
            if (deleteError) {
                console.log('Error deleting old images from storage:', deleteError);
            }
        }

        return updatedAdvisory
    } catch (error) {
        console.log('Error in creating advisory', error);
        if (error instanceof AppError) throw error
        throw new AppError(error.message || 'Internal Server Error', error.statusCode || 500)
    }
}