import * as createBlog from './blog/CreateBlog.js'
import * as updateBlog from './blog/UpdateBlog.js'
import * as getSingleBlog from './blog/GetSingleBlog.js'
import * as deleteBlog from './blog/DeleteBlog.js'
import * as allBlog from './blog/AllBlog.js'
import * as getBlogTag from './blog/GetBlogTag.js'
import * as getBlogsByTag from './blog/GetBlogsByTag.js'
import * as getBlogsBySearch from './blog/GetBlogsBySearch.js'

import * as uploadImages from './gallery/UploadImages.js'
import * as deleteImage from './gallery/DeleteImage.js'
import * as deletePost from './gallery/DeletePost.js'
import * as updateGalleryPost from './gallery/UpdateGalleryPost.js'
import * as getGalleryPost from './gallery/GetGalleryPost.js'
import * as getSingleGalleryPostById from './gallery/GetSingleGalleryPostById.js'
import * as getAllImages from './gallery/GetAllImages.js'
import * as getSingleImageById from './gallery/GetSingleImageById.js'
import * as getGalleryTags from './gallery/GetGalleryTags.js'
import * as getGalleryPostsByTag from './gallery/GetGalleryPostsByTag.js'
import * as getImagesByTag from './gallery/GetImagesByTag.js'

import * as getSchoolDetails from './school/GetSchoolDetails.js'
import * as updateSchoolDetails from './school/UpdateSchoolDetails.js'

import * as createAdvisory from './advisory/PostCreateAdvisory.js'
import * as updateAdvisory from './advisory/UpdateAdvisory.js'
import * as getAdvisory from './advisory/GetAdvisory.js'
import * as deleteAdvisory from './advisory/DeleteAdvisory.js'
import * as getSingleAdvisory from './advisory/GetSingleAdvisory.js'

import * as createTeacher from './faculty/PostCreateTeacher.js'
import * as updateTeacher from './faculty/UpdateTeacher.js'
import * as getTeacher from './faculty/GetTeacher.js'
import * as deleteTeacher from './faculty/DeleteTeacher.js'
import * as getSingleTeacher from './faculty/GetSingleTeacher.js'

import * as flashNotice from './flash_notice/PostFlashNotice.js'
import * as getFlashNotice from './flash_notice/GetFlashNotice.js'
import * as updateFlashNotice from './flash_notice/UpdateFlashNotice.js'
import * as deleteFlashNotice from './flash_notice/DeleteFlashNotice.js'

import * as noticeBoard from './notice/PostNoticeBoard.js'
import * as getNoticeBoard from './notice/GetNoticeBoard.js'
import * as updateNoticeBoard from './notice/UpdateNoticeBoard.js'
import * as deleteNoticeBoard from './notice/DeleteNoticeBoard.js'

import * as createJob from './career/PostJob.js'
import * as getJobs from './career/GetJobs.js'
import * as updateJob from './career/UpdateJob.js'
import * as deleteJob from './career/DeleteJob.js'
import * as getSingleJob from './career/GetSingleJob.js'
import * as getVacancyAnnouncement from './career/GetVacancyAnnouncement.js'

import * as submitJobApplication from './career/SubmitJobApplication.js'
import * as getAllJobApplication from './career/GetAllJobApplication.js'
import * as getJobApplication from './career/GetJobApplication.js'
import * as deleteJobApplication from './career/DeleteJobApplication.js'
import * as getJobByIdAndCorrespondingApplicants from './career/GetJobByIdAndCorrespondingApplicants.js'

import * as postStudentApplication from './student_application/PostStudentApplication.js'
import * as getAllStudentApplication from './student_application/GetAllStudentApplication.js'
import * as getSingleStudentApplication from './student_application/GetSingleStudentApplication.js'
import * as deleteStudentApplication from './student_application/DeleteStudentApplication.js'
import * as updateStudentApplication from './student_application/UpdateStudentApplication.js'

import * as getAllNotification from './notification/GetAllNotification.js'
import * as updateNotification from './notification/UpdateNotification.js'
import * as deleteNotification from './notification/DeleteNotification.js'
import * as clearAllNotification from './notification/ClearAllNotification.js'
import * as getSingleNotification from './notification/GetSingleNotification.js'

import * as postQuery from './query_form/postQuery.js'
import * as getAllQuery from './query_form/getAllQuery.js'
import * as deleteQuery from './query_form/deleteQuery.js'
import * as getSingleQuery from './query_form/getSingleQuery.js'
import * as patchQuery from './query_form/patchQuery.js'

import * as postSubscriber from './subscriber/postSubscriber.js'
import * as getAllSubscriber from './subscriber/getAllSubscriber.js'
import * as getSingleSubscriber from './subscriber/getSingleSubscriber.js'
import * as deleteSubscriber from './subscriber/deleteSubscriber.js'


export const schoolService = {
    ...createBlog,
    ...updateBlog,
    ...getSingleBlog,
    ...deleteBlog,
    ...allBlog,
    ...getBlogTag,
    ...getBlogsByTag,
    ...getBlogsBySearch,

    ...uploadImages,
    ...deleteImage,
    ...deletePost,
    ...updateGalleryPost,
    ...getGalleryPost,
    ...getSingleGalleryPostById,
    ...getAllImages,
    ...getSingleImageById,
    ...getGalleryTags,
    ...getGalleryPostsByTag,
    ...getImagesByTag,

    ...getSchoolDetails,
    ...updateSchoolDetails,

    ...createAdvisory,
    ...updateAdvisory,
    ...getAdvisory,
    ...deleteAdvisory,
    ...getSingleAdvisory,

    ...createTeacher,
    ...updateTeacher,
    ...getTeacher,
    ...deleteTeacher,
    ...getSingleTeacher,

    ...flashNotice,
    ...getFlashNotice,
    ...updateFlashNotice,
    ...deleteFlashNotice,

    ...noticeBoard,
    ...getNoticeBoard,
    ...updateNoticeBoard,
    ...deleteNoticeBoard,

    ...createJob,
    ...getJobs,
    ...updateJob,
    ...deleteJob,
    ...submitJobApplication,
    ...getSingleJob,
    ...getAllJobApplication,
    ...getJobApplication,
    ...deleteJobApplication,
    ...getJobByIdAndCorrespondingApplicants,
    ...getVacancyAnnouncement,

    ...postStudentApplication,
    ...getAllStudentApplication,
    ...getSingleStudentApplication,
    ...deleteStudentApplication,
    ...updateStudentApplication,

    ...getAllNotification,
    ...updateNotification,
    ...deleteNotification,
    ...clearAllNotification,
    ...getSingleNotification,

    ...postQuery,
    ...getAllQuery,
    ...deleteQuery,
    ...getSingleQuery,
    ...patchQuery,

    ...postSubscriber,
    ...getAllSubscriber,
    ...getSingleSubscriber,
    ...deleteSubscriber,
}
