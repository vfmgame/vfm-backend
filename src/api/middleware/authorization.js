const UserModel = require("../../models/User");
const { user } = require("../../subscribers/events");

module.exports = async (req, res, next) => {
    try {
        const userId = req.user.user_id

        const user_details = await UserModel.findOne({ userId });

        if (!user_details) {
            let error = new Error("Unauthorized access. Please login.!");
            error.statusCode = 401;
            throw error;
        } else {
            next();
        }

    } catch (error) {
        console.log(error);
        return next(error)
    }
}