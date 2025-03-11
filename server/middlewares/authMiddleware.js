import { clerkClient } from "@clerk/express";

//Middleware (Protected educator routes)
export const protectEducator = async (req, res, next) => {
	try {
		const userId = req.auth.userId;
		const response = await clerkClient.users.getUser(userId);

		//check the publicMetadata if the user is an educator
		if (response.publicMetadata.role !== "educator") {
			return res.json({ success: false, message: "Unauthorized Access" });
		} else {
			next();
		}
	} catch (error) {
		res.json({ success: false, message: error.message });
	}
};
