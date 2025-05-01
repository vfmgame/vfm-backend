const { encrypt } = require("../helper");
const userEvents = require("../subscribers/user");
const events = require("../subscribers/events");
const JWT = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');



module.exports = class AuthService {
    constructor(userModel) {
      this.userModel = userModel;
    }

    async ConnectUser(data) {
        const checkExistingUser = await this.userModel.findOne({ userId: data.userId });

        if (checkExistingUser) {
            const existing_jwt_payload = {
                userId: encrypt(data.userId.toString()),
                _id: encrypt(checkExistingUser._id.toString())
            };
            const authorization = JWT.sign(existing_jwt_payload, "example", { expiresIn: "23h" });
    
            delete checkExistingUser._doc.__v;
            checkExistingUser._doc.authorization = authorization;
            checkExistingUser._doc.expires_in = 1200000;
            checkExistingUser._doc.expires_at = 12000000;
            return checkExistingUser;
        }


        const userRecord = await new this.userModel({
            userId: data.userId,
            firstName: data.firstName,
            lastName: data.lastName,
            nickName: data.nickName,
            avatar: data.avatar,
            color: data.color,
            referralCode: `vfm${data.userId}`
        }).save();

        const jwt_payload = {
            userId: encrypt(data.userId.toString()),
            _id: encrypt(userRecord._id.toString())
        };

        
        const authorization = JWT.sign(jwt_payload, "example", { expiresIn: "23h" });

        userRecord._doc.authorization = authorization;
        userRecord._doc.expires_in = 1200000;
        userRecord._doc.expires_at = 12000000;

        const user = userRecord;

        userEvents.dispatch(events.user.signUp, { referredBy: data.referrer, userId: user._id });
        
        return user;
    }


    async CheckExistingUser(nickName, userId) {
        const checkExistingUser = await this.userModel.findOne({ nickName });
        if (checkExistingUser && checkExistingUser.userId === userId) {
            return true;
        } else if(checkExistingUser) {
            let error = new Error("Nickname is already taken...");
            error.statusCode = 400;
            throw error;
        } else {
            return true;
        }
    }
}