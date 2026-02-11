import AppError from "../../utils/appError.js"
import prisma from "../../utils/prisma.js"

export const getGalleryTags = async (req) => {
    try {
        const tags = await prisma.gallery_tag.findMany({
            select: {
                id: true,
                name: true
            }
        })
        return tags
    } catch (error) {
        console.log(error);
        throw new AppError('Error fetching tags', 500)
    }
}