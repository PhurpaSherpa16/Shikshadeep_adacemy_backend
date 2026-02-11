import AppError from "../../utils/appError.js"
import prisma from "../../utils/prisma.js"
import { supabase } from "../../utils/supabase.js"
import sharp from "sharp"

export const updateFlashNotice = async (req) => {
    try {
        const { id } = req.params
        const { title, content, isActive, startDate, endDate } = req.body
        const file = req.file

        if (!id) {
            throw new AppError("Flash notice ID is required", 400)
        }

        const flashNotice = await prisma.school_flash_notice.findUnique({
            where: { id }
        })

        if (!flashNotice) {
            throw new AppError("Flash notice not found", 404)
        }

        let imageUrl = flashNotice.image_url
        let newImageName = null

        if (file) {
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
            newImageName = `/flash-notice/Flash-Notice-${uniqueSuffix}-${file.originalname}`
            const imageBuffer = await sharp(file.buffer).resize(800, 600, { fit: 'inside' }).toBuffer()
            const { error: imageError } = await supabase.storage.from('school').upload(newImageName, imageBuffer, { contentType: file.mimetype })

            if (imageError) {
                console.log('Image uploading error', imageError);
                throw new AppError(`Image upload failed, please try again later`, 400)
            }
            imageUrl = supabase.storage.from('school').getPublicUrl(newImageName).data.publicUrl
        }

        const result = await prisma.school_flash_notice.update({
            where: { id },
            data: {
                title: title || flashNotice.title,
                content: content !== undefined ? content : flashNotice.content,
                isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : flashNotice.isActive,
                startDate: startDate ? new Date(startDate) : flashNotice.startDate,
                endDate: endDate ? new Date(endDate) : flashNotice.endDate,
                image_url: imageUrl
            }
        })

        if (!result) {
            const { error: imageError } = await supabase.storage.from('school').remove([newImageName])
            if (imageError) {
                console.log('Image deleting error', imageError);
            }
            throw new AppError("Failed to update flash notice", 500)
        }

        // Delete old image if new one uploaded
        if (file && flashNotice.image_url) {
            const oldImageName = `flash-notice/${flashNotice.image_url.split('/').pop()}`
            const { error: imageError } = await supabase.storage.from('school').remove([oldImageName])
            if (imageError) {
                console.log('Image deleting error', imageError);
            }
        }

        return result
    } catch (error) {
        console.log('Error in updateFlashNotice', error)
        if (error instanceof AppError) throw error
        throw new AppError(error.message || 'Internal Server Error', error.statusCode || 500)
    }
}
