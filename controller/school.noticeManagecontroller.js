import CatchAsync from "../utils/catchAsync.js";
import { schoolService } from "../service/SchoolService.js";

// FLASH NOTICE
export const createFlashNotice = CatchAsync(async (req, res, next) => {
    const notice = await schoolService.createFlashNotice(req)
    res.json({
        status: true,
        success: true,
        message: 'Flash notice created successfully',
        data: notice
    })
})

export const getFlashNotice = CatchAsync(async (req, res, next) => {
    const notice = await schoolService.getFlashNotice(req)
    res.json({
        status: true,
        success: true,
        message: 'Flash notice fetched successfully',
        data: notice
    })
})

export const updateFlashNotice = CatchAsync(async (req, res, next) => {
    const notice = await schoolService.updateFlashNotice(req)
    res.json({
        status: true,
        success: true,
        message: 'Flash notice updated successfully',
        data: notice
    })
})

export const deleteFlashNotice = CatchAsync(async (req, res, next) => {
    const notice = await schoolService.deleteFlashNotice(req)
    res.json({
        status: true,
        success: true,
        message: 'Flash notice deleted successfully',
        data: notice
    })
})

// NOTICE BOARD
export const createNoticeBoard = CatchAsync(async (req, res, next) => {
    const notice = await schoolService.createNoticeBoard(req)
    res.json({
        status: true,
        success: true,
        message: 'Notice board entry created successfully',
        data: notice
    })
})

export const getNoticeBoard = CatchAsync(async (req, res, next) => {
    const notice = await schoolService.getNoticeBoard(req)
    res.json({
        status: true,
        success: true,
        message: 'Notice board fetched successfully',
        data: notice
    })
})

export const updateNoticeBoard = CatchAsync(async (req, res, next) => {
    const notice = await schoolService.updateNoticeBoard(req)
    res.json({
        status: true,
        success: true,
        message: 'Notice board updated successfully',
        data: notice
    })
})

export const deleteNoticeBoard = CatchAsync(async (req, res, next) => {
    const notice = await schoolService.deleteNoticeBoard(req)
    res.json({
        status: true,
        success: true,
        message: 'Notice board entry deleted successfully',
        data: notice
    })
})
