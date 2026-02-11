import sharp from "sharp"
import AppError from "../../utils/appError.js"
import prisma from "../../utils/prisma.js"
import { supabase } from "../../utils/supabase.js"

export const updateProfile = async(req) =>{
    try {
        const {id} = req.params
        const {first_name, last_name, phone} = req.body
        const image_url = req.file

        // check id valid
        if(!id) throw new AppError('Id is required', 400)
        
        // check if user exists
        const user = await prisma.user.findUnique({where: {id}})
        if(!user) throw new AppError('User not found', 404)

        let avatar_url = user.avatar_url ? user.avatar_url : ''
        let avatar_name = null
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`

        if(image_url){
            // image upload
            avatar_name = decodeURIComponent(`user_avatar/avatar-${uniqueSuffix}-${image_url.originalname}`)
            const thumbBuffer = await sharp(image_url.buffer).resize(300, 200).toBuffer()
            const {error: imageError} = await supabase.storage.from('school').upload(avatar_name, thumbBuffer, 
                {contentType: image_url.mimetype})
            if(imageError) throw new AppError('Image upload failed, please try again later', 400)
            
            avatar_url = supabase.storage.from('school').getPublicUrl(avatar_name).data.publicUrl
        }

        const {data, error} = await prisma.user.update({
            where: {id},
            data: {
                first_name,
                last_name,
                phone,
                avatar_url
            }
        })
        if(error){
            // rollback: delete newly uploaded images if DB update fails
            if (avatar) {
                await supabase.storage.from('school').remove([avatar_name])
            }
            console.log('Database update error:', error);
            throw new AppError("Failed to update profile, please try again later", 500);
        }

        // if update success and new file was uploaded, delete old images
        if (avatar_url !== user.avatar_url) {
            const oldImageName = decodeURIComponent(`user_avatar/${user.avatar_url.split('/').pop()}`)
            const { error: deleteError } = await supabase.storage.from('school').remove([oldImageName])
            if (deleteError) {
                console.log('Error deleting old images from storage:', deleteError);
            }
        }

        console.log("data", data)
        console.log("avatar_url", avatar_url)
        console.log("avatar_name", avatar_name)
        console.log("image_url", image_url)

        return data

    } catch (error) {
        console.log(error)
        if(error instanceof AppError) throw error
        throw new AppError('Filed to update profile.', 400)
    }
}