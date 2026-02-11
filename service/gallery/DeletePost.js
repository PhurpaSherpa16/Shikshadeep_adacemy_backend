import AppError from "../../utils/appError.js"
import { supabase } from "../../utils/supabase.js"
import prisma from "../../utils/prisma.js"

export const deletePost = async (req) => {
    try {
        const { id } = req.params
        if (!id) {
            throw new AppError('Post id is required', 400)
        }
        // get images
        const images = await prisma.gallery_image.findMany({
            where: { gallery_post_id_fk: id },
            select: { image_url: true }
        })
        if (!images || images.length === 0) {
            console.log('Images not found', images);
            throw new AppError('Images not found', 404)
        }

        console.log('images', images)

        // bulk image delete using loop
        for (const image of images) {
            // image name
            const imageName = image.image_url.split('/').pop()

            // delete image from supabase storage
            const { error: imageDeleteError } = await supabase.storage.from('gallery')
                .remove([imageName])
            if (imageDeleteError) {
                console.log("Image delete error", imageDeleteError);
                throw new AppError('Image delete failed', 500)
            }
            console.log('Image deleted successfully', imageName)
        }

        // delete images
        const tempDeleteImages = await prisma.gallery_image.deleteMany({
            where: { gallery_post_id_fk: id }
        })
        if (!tempDeleteImages) {
            console.log('Images not found', tempDeleteImages);
            throw new AppError('Images not found', 404)
        }

        // delete post
        const post = await prisma.gallery_post.delete({
            where: { id: id }
        })
        if (!post) {
            console.log('Post not found', post);
            throw new AppError('Post not found', 404)
        }


        return post
    } catch (error) {
        console.log(error);
        if (error instanceof AppError) throw error
        throw new AppError('Error deleting post', 500)
    }
}