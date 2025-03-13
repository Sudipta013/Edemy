import Stripe from "stripe";
import Course from "../models/Course.js";
import { Purchase } from "../models/Purchase.js";
import User from "../models/User.js";

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
        const userData = await User.findById(userId).populate('enrolledCourses');

        res.json({ success: true, enrolledCourses: userData.enrolledCourses });
        
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

//function to purchase course
export const purchaseCourse = async (req, res) => {
    try {

        const {courseId} = req.body
        const { origin } = req.headers
        const userId = req.auth.userId;

        const userData = await User.findById(userId);

        const courseData = await Course.findById(courseId);

        if(!userData || !courseData) {
            return res.json({ success: false, message: "User or Course not found" });
        }

        const purchaseData = {
            courseId: courseData._id,
            userId,
            amount: (courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2),
        }

        const newPurchase = await Purchase.create(purchaseData);

        //initialize stripe gateway
        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

        const currency = process.env.CURRENCY.toLowerCase();

        //creating line items for stripe
        const line_items = [{
            price_data:{
                currency,
                product_data:{
                    name: courseData.courseTitle,
                },
                unit_amount: Math.floor(newPurchase.amount) * 100
            },
            quantity: 1
        }]

        const session = await stripeInstance.checkout.sessions.create({
            line_items: line_items,
            mode: 'payment',
            success_url: `${origin}/loading/my-enrollments`,
            cancel_url: `${origin}/`,
            metadata:{
                purchaseId: newPurchase._id.toString()
            },
            customer_details: {
                name: userData.name || "Guest User",
                address: {
                    line1: userData.address?.line1 || "Default Address",
                    city: userData.city?.city || "Default City",
                    state: userData.state?.state || "Default State",
                    postal_code: userData.postalCode?.postalCode || "Default Postal Code",
                    country: userData.country?.country || "IN",
                }
            }
        })

        res.json({ success: true, session_url: session.url });
        
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
