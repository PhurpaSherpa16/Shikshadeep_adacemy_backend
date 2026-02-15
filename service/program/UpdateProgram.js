import sharp from "sharp"
import { supabase } from '../../utils/supabase.js';
import AppError from "../../utils/appError.js";
import prisma from "../../utils/prisma.js";

export const updateProgram = async (req) => {
    let uploadedFiles = []
    try {
        const { id } = req.params
        const { title, grade, description, features } = req.body
        const file = req.file

        if (!id) {
            throw new AppError("Program ID is required", 400)
        }

        const existingProgram = await prisma.program.findUnique({
            where: { id },
            include: { features: true }
        })

        if (!existingProgram) {
            throw new AppError("Program not found", 404)
        }

        let imageUrl = existingProgram.image_url
        let oldImageName = null

        if (file) {
            // Processing new image with sharp
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
                console.error('Upload failed for program image update:', uploadError)
                throw new AppError("Program image upload failed", 400)
            }

            uploadedFiles = [imageName]
            imageUrl = supabase.storage.from('program_images').getPublicUrl(imageName).data.publicUrl
            oldImageName = existingProgram.image_url.split('/').pop()
        }

        // Parse features
        let parsedFeatures = null
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

        try {
            const updatedProgram = await prisma.$transaction(async (tx) => {
                // Update program
                await tx.program.update({
                    where: { id },
                    data: {
                        title: title || existingProgram.title,
                        grade: grade || existingProgram.grade,
                        description: description || existingProgram.description,
                        image_url: imageUrl
                    }
                })

                // Update features if provided
                if (parsedFeatures !== null) {
                    // Delete old features
                    await tx.program_feature.deleteMany({
                        where: { program_id_fk: id }
                    })

                    // Create new features
                    if (parsedFeatures.length > 0) {
                        await tx.program_feature.createMany({
                            data: parsedFeatures.map(f => ({
                                title: f,
                                program_id_fk: id
                            }))
                        })
                    }
                }

                return tx.program.findUnique({
                    where: { id },
                    select: {
                        id: true,
                        title: true,
                    },
                })
            })

            // Clean up old image if new one was uploaded successfully
            if (oldImageName) {
                await supabase.storage.from('program_images').remove([oldImageName])
                    .catch(err => console.error("Failed to remove old image:", err))
            }

            return updatedProgram

        } catch (error) {
            console.error('Database error in updateProgram:', error)

            // Rollback uploaded file if DB update failed
            if (uploadedFiles.length > 0) {
                await supabase.storage.from('program_images').remove(uploadedFiles)
                .catch(err => console.error("Rollback cleanup failed in updateProgram:", err))
            }

            if (error.code === 'P2002') {
                throw new AppError("A program or feature with this title already exists", 400)
            }
            throw error
        }

    } catch (error) {
        console.error("Error in updateProgram:", error)

        if (uploadedFiles.length > 0) {
            await supabase.storage.from('program_images').remove(uploadedFiles)
                .catch(err => console.error("Rollback cleanup failed in updateProgram:", err))
        }

        if (error instanceof AppError) throw error
        throw new AppError("Failed to update program, please try again later.", 500)
    }
}
