import CatchAsync from "../utils/catchAsync.js";
import { schoolService } from "../service/SchoolService.js";

// JOB VACANCY
export const createJob = CatchAsync(async (req, res, next) => {
    const job = await schoolService.createJob(req)
    res.json({
        status: true,
        success: true,
        message: 'Job vacancy created successfully',
        data: job
    })
})

export const getJobs = CatchAsync(async (req, res, next) => {
    const jobs = await schoolService.getJobs(req)
    res.json({
        status: true,
        success: true,
        message: 'Job vacancies fetched successfully',
        data: jobs
    })
})

export const updateJob = CatchAsync(async (req, res, next) => {
    const job = await schoolService.updateJob(req)
    res.json({
        status: true,
        success: true,
        message: 'Job vacancy updated successfully',
        data: job
    })
})

export const deleteJob = CatchAsync(async (req, res, next) => {
    const job = await schoolService.deleteJob(req)
    res.json({
        status: true,
        success: true,
        message: 'Job vacancy deleted successfully',
        data: job
    })
})

// GET SINGLE JOB
export const getSingleJob = CatchAsync(async (req, res, next) => {
    const job = await schoolService.getSingleJob(req)
    res.json({
        status: true,
        success: true,
        message: 'Job fetched successfully',
        data: job
    })
})

// JOB APPLICATION
export const submitJobApplication = CatchAsync(async (req, res, next) => {
    const application = await schoolService.submitJobApplication(req)
    res.json({
        status: true,
        success: true,
        message: 'Job application submitted successfully',
        data: application
    })
})

// GET ALL JOB APPLICATION
export const getAllJobApplication = CatchAsync(async (req, res, next) => {
    const applications = await schoolService.getAllJobApplication(req)
    res.json({
        status: true,
        success: true,
        message: 'Job applications fetched successfully',
        data: applications
    })
})

// GET SINGLE JOB APPLICATION
export const getJobApplication = CatchAsync(async (req, res, next) => {
    const application = await schoolService.getJobApplication(req)
    res.json({
        status: true,
        success: true,
        message: 'Job application fetched successfully',
        data: application
    })
})

// DELETE JOB APPLICATION
export const deleteJobApplication = CatchAsync(async (req, res, next) => {
    const application = await schoolService.deleteJobApplication(req)
    res.json({
        status: true,
        success: true,
        message: 'Job application deleted successfully',
        data: application
    })
})
