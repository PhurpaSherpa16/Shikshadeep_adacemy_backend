import express from "express";
import { getSchoolDetails, updateSchoolDetails } from "../controller/school.getSchoolDetailscontroller.js";
import { createAdvisory, deleteAdvisory, getAdvisory, updateAdvisory, getSingleAdvisory} from "../controller/school.advisoryManagecontroller.js";
import multer from "multer"
import { createTeacher, deleteTeacher, getSingleTeacher, getTeacher, updateTeacher } from "../controller/school.teacherManagecontroller.js";
import { createFlashNotice, deleteFlashNotice, getFlashNotice, updateFlashNotice, createNoticeBoard, deleteNoticeBoard, getNoticeBoard, updateNoticeBoard } from "../controller/school.noticeManagecontroller.js";
import { createJob, deleteJob, getAllJobApplication, getJobs, getSingleJob, submitJobApplication, updateJob, getJobApplication, deleteJobApplication } from "../controller/school.careersManagecontroller.js";
import { uploadImage, uploadJobFiles } from "../utils/multer.js";

const router = express.Router()
const upload = multer()


// PUT
// School details updating
router.put("/update/:id", upload.none(), updateSchoolDetails)
// Advisory updating
router.put("/advisory/update/:id", uploadImage, updateAdvisory)
// Teacher updating
router.put("/teacher/update/:id", uploadImage, updateTeacher)
// Flash Notice updating
router.put("/flash-notice/update/:id", uploadImage, updateFlashNotice)
// Notice Board updating
router.put("/notice-board/update/:id", upload.none(), updateNoticeBoard)
// Job updating
router.put("/job/update/:id", uploadJobFiles, updateJob)

// POST
// Advisory creating
router.post("/advisory/create", uploadImage, createAdvisory)
// Teacher creating
router.post("/teacher/create", uploadImage, createTeacher)
// Flash Notice creating
router.post("/flash-notice/create", uploadImage, createFlashNotice)
// Notice Board creating
router.post("/notice-board/create", upload.none(), createNoticeBoard)
// Job creating
router.post("/job/create", uploadJobFiles, createJob)
// Job Application submission
router.post("/job/apply/:id", uploadJobFiles, submitJobApplication)

// DELETE
// Advisory deleting
router.delete("/advisory/delete/:id", deleteAdvisory)
// Teacher deleting
router.delete("/teacher/delete/:id", deleteTeacher)
// Flash Notice deleting
router.delete("/flash-notice/delete/:id", deleteFlashNotice)
// Notice Board deleting
router.delete("/notice-board/delete/:id", deleteNoticeBoard)
// Job deleting
router.delete("/job/delete/:id", deleteJob)
// Job Application deleting
router.delete("/job/application/delete/:id", deleteJobApplication)


// GET 
// School details getting
router.get("/", getSchoolDetails)
// Advisory getting
router.get("/advisory", getAdvisory)
// Single Advisory getting
router.get("/advisory/:id", getSingleAdvisory)
// Teacher getting
router.get("/teachers", getTeacher)
// Single Teacher getting
router.get("/teacher/:id", getSingleTeacher)
// Flash Notice getting
router.get("/flash-notice", getFlashNotice)
// Notice Board getting
router.get("/notice-board", getNoticeBoard)
// Jobs getting
router.get("/jobs", getJobs)
// View job
router.get("/job/:id", getSingleJob)
// Job All applications getting
router.get("/job/all/applications", getAllJobApplication)
// Job Application getting
router.get("/job/application/:id", getJobApplication)

export default router