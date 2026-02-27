import AppError from "../../utils/appError.js"
import prisma from "../../utils/prisma.js"
import { supabase } from "../../utils/supabase.js"
import sharp from "sharp"

export const createFlashNotice = async (req) => {
    let imageName = null
    try {
        const { title, content, isActive, startDate, endDate } = req.body
        const file = req.file

        if (!title) {
            throw new AppError("Title is required", 400)
        }

        let imageUrl = null

        // Image processing and upload
        if (file) {
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
            imageName = `flash-notice/Flash-Notice-${uniqueSuffix}-${file.originalname}`

            const imageBuffer = await sharp(file.buffer).resize(800, 600, { fit: 'inside' }).toBuffer()
            const { error: imageError } = await supabase.storage.from('school').upload(imageName, imageBuffer, {
                contentType: file.mimetype
            })

            if (imageError) {
                console.error('Image upload error in createFlashNotice:', imageError)
                throw new AppError("Image upload failed", 400)
            }
            imageUrl = supabase.storage.from('school').getPublicUrl(imageName).data.publicUrl
        }

        // Database Entry
        try {
            const result = await prisma.school_flash_notice.create({
                data: {
                    title: title.toLowerCase(),
                    content: content?.toLowerCase() || null,
                    isActive: isActive === 'true' || isActive === true,
                    startDate: startDate ? new Date(startDate) : null,
                    endDate: endDate ? new Date(endDate) : null,
                    image_url: imageUrl
                }
            })
            return result

        } catch (error) {
            console.error('Database error in createFlashNotice:', error)
            // Rollback image upload
            if (imageName) {
                const imageDelete = await supabase.storage.from('school').remove([imageName])
                    .catch(err => console.error("Rollback cleanup failed in createFlashNotice:", err))
                if (!imageDelete) {
                    console.error('Image delete error in createFlashNotice:', imageDelete.error)
                    throw new AppError("Image delete failed.", 400)
                }
            }
            if (error.code === 'P2002') {
                throw new AppError("A flash notice with this content already exists", 400)
            }
            throw error
        }

    } catch (error) {
        console.error('Error in createFlashNotice:', error)
        if (error instanceof AppError) throw error
        throw new AppError(error.message || 'Internal Server Error', 500)
    }
}
