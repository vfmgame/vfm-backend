const bcrypt = require("bcryptjs");
const { encrypt, generateRandomNDigits } = require("../helper");
const axios = require("axios").default;
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

    async CreateUser(data) {
        const checkExistingUser = await this.userModel.findOne({ userId: data.userId });

        if (checkExistingUser) return checkExistingUser;
        

        const userRecord = await this.userModel.create({
            id: await uuidv4(),
            userId: data.userId,
            firstname: data.firstName,
            lastname: data.lastName,
            nickname: data.nickname,
            avatar: data.avatar,
            color: data.color,
            referral_code: `vfm${data.userId}`
        });


        delete userRecord._doc._id;
        delete userRecord._doc.__v;

        const user = userRecord;

        if(data.referrer) {
            userEvents.dispatch(events.user.signUp, { referred_by: data.referrer, userId: user.userId });
        }
        
        return user;
    }


    async CheckExistingUser(data) {
        const checkExistingUser = await this.userModel.findOne({ nickname: data.nickname });
        if (checkExistingUser && checkExistingUser.userId === data.userId) {
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