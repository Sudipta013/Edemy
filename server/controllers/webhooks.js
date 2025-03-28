import { Webhook } from "svix";
import User from "../models/User.js";
import Stripe from "stripe";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";

//API controller function to Manage Clerk User with database

export const clerkWebhooks = async (req, res) => {
	try {
		const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

		await whook.verify(JSON.stringify(req.body), {
			"svix-id": req.headers["svix-id"],
			"svix-timestamp": req.headers["svix-timestamp"],
			"svix-signature": req.headers["svix-signature"],
		});

		const { data, type } = req.body;

		switch (type) {
			case "user.created": {
				const userData = {
					_id: data.id,
					email: data.email_addresses[0].email_address,
					name: data.first_name + " " + data.last_name,
					imageUrl: data.image_url,
				};

				await User.create(userData);
				res.json({});
				break;
			}

			case "user.updated": {
				const userData = {
					email: data.email_addresses[0].email_address,
					name: data.first_name + " " + data.last_name,
					imageUrl: data.image_url,
				};

				await User.findByIdAndUpdate(data.id, userData);
				res.json({});
				break;
			}

			case "user.deleted": {
				await User.findByIdAndDelete(data.id);
				res.json({});
				break;
			}

			default: {
				break;
			}
		}
	} catch (error) {
		res.json({ success: false, message: error.message });
	}
};

//API controller function to Manage Stripe User with database

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
export const stripeWebhooks = async (req, res) => {
	const sig = req.headers["stripe-signature"];
	let event;

	try {
		event = Stripe.webhooks.constructEvent(
			req.body,
			sig,
			process.env.STRIPE_WEBHOOK_SECRET
		);
	} catch (err) {
		console.log(err.message);
		return res.status(400).send(`Webhook Error: ${err.message}`);
	}

	switch (event.type) {
		case "payment_intent.succeeded": {
			try {
				const paymentIntent = event.data.object;
				const paymentIntentId = paymentIntent.id;
		
				const sessions = await stripeInstance.checkout.sessions.list({
					payment_intent: paymentIntentId,
				});

				console.log("Stripe Sessions:", sessions.data);
		
				if (!sessions.data.length) {
					// console.error("No matching Stripe session found");
					return res.status(400).json({ error: "Session not found" });
				}
		
				const { purchaseId } = sessions.data[0].metadata;

				console.log("Session Metadata:", sessions.metadata);

		
				if (!purchaseId) {
					// console.error("Missing purchaseId in metadata");
					return res.status(400).json({ error: "Invalid metadata" });
				}
		
				const purchaseData = await Purchase.findById(purchaseId);
		
				if (!purchaseData) {
					// console.error("Purchase record not found");
					return res.status(400).json({ error: "Purchase not found" });
				}
		
				const userData = await User.findById(purchaseData.userId);
				if (!userData) {
					// console.error("User record not found");
					return res.status(400).json({ error: "User not found" });
				}
		
				const courseData = await Course.findById(purchaseData.courseId.toString());
				if (!courseData) {
					console.error("Course record not found");
					return res.status(400).json({ error: "Course not found" });
				}
		
				courseData.enrolledStudents.push(userData._id);
				await courseData.save();
		
				userData.enrolledCourses.push(courseData._id);
				await userData.save();
		
				purchaseData.status = "completed";
				await purchaseData.save();
		
				res.json({ received: true });

			} catch (err) {
				// console.error("Error handling payment_intent.succeeded:", err);
				return res.status(500).json({ error: "Internal Server Error" });
			}

			break;
		}
		case "payment_intent.payment_failed": {
			const paymentIntent = event.data.object;
			const paymentIntentId = paymentIntent.id;

			const sessions = await stripeInstance.checkout.sessions.list({
				payment_intent: paymentIntentId,
			});

			if (!sessions.data.length) {
				console.error("No matching Stripe session found");
				return res.status(400).json({ error: "Session not found" });
			}

			const { purchaseId } = sessions.data[0].metadata;

			const purchaseData = await Purchase.findById(purchaseId);

			if (!purchaseData) {
				console.error("Purchase record not found");
				return res.status(400).json({ error: "Purchase not found" });
			}

			purchaseData.status = "failed";
			await purchaseData.save();

			break;
		}
		// ... handle other event types
		default:
			console.log(`Unhandled event type ${event.type}`);
	}
	res.json({ received: true });
};
