import CatchAsync from "../utils/catchAsync.js"
import { userService } from "../service/UserService.js"

export const getProfile = CatchAsync(async (req, res, next) => {
    const data = await userService.getProfile(req)
    res.status(200).json({
        status: true,
        success: true,
        data
    })
})

export const updateProfile = CatchAsync(async (req, res, next) => {
    const data = await userService.updateProfile(req)
    res.status(200).json({
        status: true,
        success: true,
        message: 'Profile updated successfully',
        data
    })
})