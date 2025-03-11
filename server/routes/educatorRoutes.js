import express from "express";
import { addNewCourse, getEducatorCourses, getEducatorDashboardData, getEnrolledStudentsData, updateRoleToEducator } from "../controllers/educatorController.js";
import upload from "../configs/multer.js";
import { protectEducator } from "../middlewares/authMiddleware.js";

const educatorRouter = express.Router();

//add Educator role 
educatorRouter.get("/update-role", updateRoleToEducator);
educatorRouter.post("/add-course", upload.single("image"),protectEducator, addNewCourse);
educatorRouter.get("/courses",protectEducator,getEducatorCourses);
educatorRouter.get("/dashboard",protectEducator,getEducatorDashboardData);
educatorRouter.get("/enrolled-students",protectEducator,getEnrolledStudentsData);

export default educatorRouter;