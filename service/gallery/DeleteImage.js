import AppError from "../../utils/appError.js"
import { supabase } from "../../utils/supabase.js"
import prisma from "../../utils/prisma.js"

export const deleteImage = async (req) => {
    try {
        const { id } = req.params
        if (!id) {
            throw new AppError('Image id is required', 400)
        }
        const image = await prisma.gallery_image.delete({
            where: { id: id }
        })

        // image name
        const imageName = image.image_url.split('/').pop()
        // delete image from supabase storage
        await supabase.storage.from('gallery').remove([imageName])

        return image

    } catch (error) {
        console.log(error);
        if(error.code === 'P2025'){
            throw new AppError('Image not found of this id.', 404)
        }
        if (error instanceof AppError) throw error
        throw new AppError('Error deleting image', 500)
    }
}