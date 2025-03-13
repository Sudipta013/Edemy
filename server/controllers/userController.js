import Stripe from "stripe";
import Course from "../models/Course.js";
import { Purchase } from "../models/Purchase.js";
import User from "../models/User.js";
import { CourseProgress } from "../models/CourseProgress.js";

//function to get user data
export const getUserData = async (req, res) => {
	try {
		const userId = req.auth.userId;
		const user = await User.findById(userId);

		if (!user) {
			return res.json({ success: false, message: "User not found" });
		}

		res.json({ success: true, user });
	} catch (error) {
		res.json({ success: false, message: error.message });
	}
};

// Users Enrolled courses with lecture links
export const getUserEnrolledCourses = async (req, res) => {
	try {
		const userId = req.auth.userId;
		const userData = await User.findById(userId).populate("enrolledCourses");

		res.json({ success: true, enrolledCourses: userData.enrolledCourses });
	} catch (error) {
		res.json({ success: false, message: error.message });
	}
};

//function to purchase course
export const purchaseCourse = async (req, res) => {
	try {
		const { courseId } = req.body;
		const { origin } = req.headers;
		const userId = req.auth.userId;

		const userData = await User.findById(userId);

		const courseData = await Course.findById(courseId);

		if (!userData || !courseData) {
			return res.json({ success: false, message: "User or Course not found" });
		}

		const purchaseData = {
			courseId: courseData._id,
			userId,
			amount: (
				courseData.coursePrice -
				(courseData.discount * courseData.coursePrice) / 100
			).toFixed(2),
		};

		const newPurchase = await Purchase.create(purchaseData);

		//initialize stripe gateway
		const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

		const currency = process.env.CURRENCY.toLowerCase();

		//creating line items for stripe
		const line_items = [
			{
				price_data: {
					currency,
					product_data: {
						name: courseData.courseTitle,
					},
					unit_amount: Math.floor(parseFloat(newPurchase.amount) * 100),
				},
				quantity: 1,
			},
		];

		const customer = await stripeInstance.customers.create({
			email: userData.email,
			name: userData.name || "Guest User",
			address: {
				line1: userData.address?.line1 || "Default Address",
				city: userData.city?.city || "Default City",
				state: userData.state?.state || "Default State",
				postal_code: userData.postalCode?.postalCode || "Default Postal Code",
				country: userData.country?.country || "IN",
			},
			metadata: {
				userId: userData._id.toString(),
			},
		});

		const session = await stripeInstance.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: line_items,
			mode: "payment",
			success_url: `${origin}/loading/my-enrollments`,
			cancel_url: `${origin}/`,
			payment_intent_data: {
				metadata: {
					purchaseId: newPurchase._id.toString(),
				},
			},
			customer: customer.id,
		});

		res.json({ success: true, session_url: session.url });
	} catch (error) {
		res.json({ success: false, message: error.message });
	}
};

// update User Course Progress
export const updateUserCourseProgress = async (req, res) => {
	try {
		const userId = req.auth.userId;
		const { courseId, lectureId } = req.body;

		const progressData = await CourseProgress.findOne({ userId, courseId });

		if (progressData) {
			if (progressData.lectureCompleted.includes(lectureId)) {
				return res.json({
					success: true,
					message: "Lecture already completed",
				});
			}
			progressData.lectureCompleted.push(lectureId);
			await progressData.save();
		} else {
			await CourseProgress.create({
				userId,
				courseId,
				lectureCompleted: [lectureId],
			});
		}

		res.json({ success: true, message: "Course Progress Updated" });
	} catch (error) {
		res.json({ success: false, message: error.message });
	}
};

// get User Course Progress
export const getUserCourseProgress = async (req, res) => {
	try {
		const userId = req.auth.userId;
		const { courseId } = req.body;

		const progressData = await CourseProgress.findOne({ userId, courseId });

		res.json({ success: true, progressData });
	} catch (error) {
		res.json({ success: false, message: error.message });
	}
};

// add user rating to course
export const addUserRating = async (req, res) => {
	const userId = req.auth.userId;
	const { courseId, rating } = req.body;

	//validate
	if (!userId || !courseId || !rating || rating < 1 || rating > 5) {
		return res.json({
			success: false,
			message: "Please provide all required fields",
		});
	}
	try {
		const course = await Course.findById(courseId);

		if (!course) {
			return res.json({
				success: false,
				message: "Course not found",
			});
		}

		const user = await User.findById(userId);

		if (!user || !user.enrolledCourses.includes(courseId)) {
			return res.json({
				success: false,
				message: "User has not enrolled in this course",
			});
		}

		const existingRatingIndex = course.courseRatings.findIndex(
			(r) => r.userId === userId
		);

		if (existingRatingIndex > -1) {
			course.courseRatings[existingRatingIndex].rating = rating;
			await course.save();
		} else {
			course.courseRatings.push({ userId, rating });
			await course.save();
		}

		res.json({ success: true, message: "Rating added successfully" });
	} catch (error) {
		res.json({ success: false, message: error.message });
	}
};
