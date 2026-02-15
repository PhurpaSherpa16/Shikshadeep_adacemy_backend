import { programService } from "../service/ProgramService.js"
import CatchAsync from "../utils/catchAsync.js"

export const postProgram = CatchAsync(async (req, res, next) => {
    const program = await programService.createProgram(req)
    res.json({
        status: true,
        success: true,
        message: 'Program created successfully',
        data: program
    })
})

export const updateProgram = CatchAsync(async (req, res, next) => {
    const program = await programService.updateProgram(req)
    res.json({
        status: true,
        success: true,
        message: 'Program updated successfully',
        data: program
    })
})

export const deleteProgram = CatchAsync(async (req, res, next) => {
    const result = await programService.deleteProgram(req)
    res.json({
        status: true,
        success: true,
        message: result.message
    })
})

export const updateDisplayOrder = CatchAsync(async (req, res, next) => {
    const result = await programService.updateDisplayOrder(req)
    res.json({
        status: true,
        success: true,
        message: result.message
    })
})
