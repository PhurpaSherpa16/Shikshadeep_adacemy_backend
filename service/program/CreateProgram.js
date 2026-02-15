import sharp from "sharp"
import { supabase } from '../../utils/supabase.js';
import AppError from "../../utils/appError.js";
import prisma from "../../utils/prisma.js";

export const createProgram = async (req) => {
    let uploadedFiles = []
    try {
        const { title, grade, description, features } = req.body
        const file = req.file

        // Validation
        if (!title || !grade || !description) {
            throw new AppError("Title, grade, and description are required", 400);
        }
        if (!file) {
            throw new AppError("Image is required.", 400);
        }

        // Get the maximum displayOrder from the existing programs
        const maxDisplayOrder = await prisma.program.findFirst({
            select: {
                displayOrder: true
            },
            orderBy: {
                displayOrder: 'desc'
            }
        })
        const newDisplayOrder = maxDisplayOrder ? maxDisplayOrder.displayOrder + 1 : 1

        // Parse features if they come as a string or array
        let parsedFeatures = []
        if (features) {
            if (Array.isArray(features)) {
                parsedFeatures = features
            } else {
                try {
                    parsedFeatures = JSON.parse(features)
                    if (!Array.isArray(parsedFeatures)) parsedFeatures = [parsedFeatures]
                } catch (e) {
                    parsedFeatures = features.split(',').map(f => f.trim()).filter(f => f !== '')
                }
            }
        }

        // Image processing with sharp
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
        const imageName = `${uniqueSuffix}-${file.originalname.replace(/\s+/g, '_').split('.')[0]}.webp`

        const optimizedBuffer = await sharp(file.buffer)
            .resize(1000, 667, {
                fit: 'cover',
                position: 'center'
            })
            .webp({ quality: 80 })
            .toBuffer()

        const { error: uploadError } = await supabase.storage
            .from('program_images')
            .upload(imageName, optimizedBuffer, { contentType: 'image/webp' })

        if (uploadError) {
            console.error('Upload failed for program image:', uploadError)
            throw new AppError("Program image upload failed", 400)
        }

        uploadedFiles = [imageName]
        const imageUrl = supabase.storage.from('program_images').getPublicUrl(imageName).data.publicUrl

        try {
            const program = await prisma.program.create({
                data: {
                    title,
                    grade,
                    description,
                    image_url: imageUrl,
                    displayOrder: newDisplayOrder,
                    features: {
                        create: parsedFeatures.map(f => ({ title: f }))
                    }
                },
                select: {
                    id: true,
                    title: true,
                },
            })
            return program

        } catch (error) {
            console.error('Database error in createProgram:', error)

            // Rollback cleanup
            await supabase.storage.from('program_images').remove(uploadedFiles)
            .catch(err => console.error("Rollback cleanup failed in createProgram:", err))

            if (error.code === 'P2002') {
                throw new AppError("A program with this title, grade, or description already exists", 400)
            }
            throw error 
        }

    } catch (error) {
        console.error("Error in createProgram:", error)

        if (uploadedFiles.length > 0) {
            await supabase.storage.from('program_images').remove(uploadedFiles)
                .catch(err => console.error("Rollback cleanup failed in createProgram:", err))
        }

        if (error instanceof AppError) throw error
        throw new AppError("Failed to create program entry", error.statusCode || 500)
    }
}
