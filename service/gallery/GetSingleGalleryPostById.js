import AppError from "../../utils/appError.js"
import prisma from "../../utils/prisma.js"

export const getSingleGalleryPostById = async (req) => {
    try {
        const { id } = req.params
        if (!id) {
            throw new AppError('Gallery post id is required', 400)
        }
        const galleryPost = await prisma.gallery_post.findUnique({
            where: {
                id: id
            },
            select: {
                id: true,
                title: true,
                caption: true,
                images: {
                    select: {
                        id: true,
                        image_url: true
                    }
                },
                galleryPostTags: {
                    select: {
                        tag: {
                            select: {
                                id: true,
                                name: true,
                            }
                        }
                    }
                }
            }
        })
        if (!galleryPost) {
            throw new AppError('Gallery post not found', 404)
        }
        return galleryPost

    } catch (error) {
        console.log(error);
        if (error instanceof AppError) throw error
        throw new AppError('Error fetching gallery post', 500)
    }
}