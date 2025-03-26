const bcrypt = require("bcryptjs");
const { encrypt, generateRandomNDigits } = require("../helper");
const Secrets = require("../config");
const userEvents = require("../subscribers/user");
const events = require("../subscribers/events");
const JWT = require("jsonwebtoken");
const randtoken = require('rand-token');
const { v4: uuidv4 } = require('uuid');



module.exports = class AuthService {
    constructor(userModel) {
      this.userModel = userModel;
    }

    async ConnectUser(data) {
        const checkExistingUser = await this.userModel.findOne({ userId: data.userId });

        if (checkExistingUser) {
            const jwt_payload = {
                user_id: encrypt(checkExistingUser.userId.toString())
            };
    
            const authorization = JWT.sign(jwt_payload, "example", { expiresIn: "23h" });
    
            delete checkExistingUser._id;
            delete checkExistingUser.__v;
            checkExistingUser.authorization = authorization;
            checkExistingUser.exists = true;
            checkExistingUser.expires_in = 1200000;
            checkExistingUser.expires_at = 12000000;
            return checkExistingUser;
        }


        const userRecord = await this.userModel.create({
            id: await uuidv4(),
            userId: data.userId,
            firstname: data.firstname,
            lastname: data.lastname,
            nickname: data.nickname,
            avatar: data.avatar,
            color: data.color,
            referral_code: `vfm${data.userId}`
        });

        const jwt_payload = {
            user_id: encrypt(userRecord.userId.toString())
        };

        const authorization = JWT.sign(jwt_payload, "exmaple", { expiresIn: "23h" });


        delete userRecord._id;
        delete userRecord.__v;
        userRecord.authorization = authorization;
        userRecord.exists = false;
        userRecord.expires_in = 1200000;
        userRecord.expires_at = 12000000;

        const user = userRecord;

        if(data.referrer) {
            userEvents.dispatch(events.user.signUp, { referred_by: data.referrer, userId: user.userId });
        }
        
        return user;
    }


    async CheckExistingUser(nickname, userId) {
        const checkExistingUser = await this.userModel.findOne({ nickname });
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



    async SetNickName(data) {
        const ts = new Date(); // timestamp
        const updateUser = await this.userModel.findOneAndUpdate({ userId: data.userId }, {
            $set: {
                nickname: data.nickname,
                updated_at: ts
            },
        },
        {
            new: true
        });
        if (!updateUser) {
            let error = new Error("Could not set nickname! Try again!");
            error.statusCode = 400;
            throw error;
        } else {
            delete updateUser._doc._id;
            delete updateUser._doc.__v;
            return updateUser;
        }
    }
}