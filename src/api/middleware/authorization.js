const UserModel = require("../../models/User");
const Secrets = require("../../config");

module.exports = async (req, res, next) => {
    const subscriptionStatus = ["incomplete", "unpaid", "canceled", "past_due", "incomplete_expired"]
    try {
        // if (req.body.user.user_role !== Secrets.USER_TYPE) {
        //     let error = new Error("Unauthorized User");
        //     error.statusCode = 401;
        //     throw error;
        // }

        const email = req.body.user.user_email

        const user_details = await UserModel.findOne({ email });

        if (!user_details) {
            let error = new Error("Unauthorized access. Please login.!");
            error.statusCode = 401;
            throw error;
        } else {
            next();
        }
        
        // if (user_details.email_verified === false) {
        //     let error = new Error("You must verify your email to continue.");
        //     error.statusCode = 401;
        //     throw error;
        // }

        // if (subscriptionStatus.includes(subscription.subscription_status)) {
        //     let error = new Error("Subscribe to continue!");
        //     error.statusCode = 401;
        //     throw error;
        // }

        // if(user_details.status === "deactivated") {
        //     let error = new Error("Account Suspended. Please contact support.");
        //     error.statusCode = 401;
        //     throw error;
        // } else {
        //     next();
        // }

    } catch (error) {
        console.log(error);
        return next(error)
    }
}