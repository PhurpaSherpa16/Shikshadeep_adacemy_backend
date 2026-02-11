import AppError from "../../utils/appError.js"
import prisma from "../../utils/prisma.js"

export const getSingleImageById = async (req) => {
    try {
        const { id } = req.params
        if (!id) {
            throw new AppError('Image id is required', 400)
        }
        const image = await prisma.gallery_image.findUnique({
            where: { id: id },
            select: {
                id: true,
                image_url: true,
                post: {
                    select: {
                        id: true,
                        title: true,
                        caption: true
                    }
                },
                tags: {
                    select: {
                        tag: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        })
        if (!image) {
            throw new AppError('Image not found', 404)
        }
        return image
    } catch (error) {
        console.log(error);
        if (error instanceof AppError) throw error
        throw new AppError('Error fetching image', 500)
    }
}