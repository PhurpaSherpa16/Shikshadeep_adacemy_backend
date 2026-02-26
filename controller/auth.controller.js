import { authService } from "../service/AuthService.js"
import CatchAsync from "../utils/catchAsync.js"

export const signup = CatchAsync(async (req, res, next) => {
    const data = await authService.signUp(req)
    res.status(201).json({
        status: true,
        success: true,
        message: 'Sign up successful',
        data: data
    })
})

export const signin = CatchAsync(async (req, res, next) => {
    const data = await authService.signIn(req)
    res.status(200).json({
        status: true,
        success: true,
        message: 'Sign in successful',
        data: data
    })
})

export const logout = CatchAsync(async (req, res, next) => {
    const data = await authService.signOut()
    res.status(200).json({
        status: true,
        success: true,
        message: 'Logout successful',
        data: data
    })
})
