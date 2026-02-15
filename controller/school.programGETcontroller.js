import { programService } from "../service/ProgramService.js"
import CatchAsync from "../utils/catchAsync.js"

export const getAllPrograms = CatchAsync(async (req, res, next) => {
    const programs = await programService.allPrograms(req)
    res.json({
        status: true,
        success: true,
        data: programs
    })
})

export const getSingleProgram = CatchAsync(async (req, res, next) => {
    const program = await programService.getSingleProgram(req)
    res.json({
        status: true,
        success: true,
        data: program
    })
})
