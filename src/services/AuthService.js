const bcrypt = require("bcryptjs");
const { generateUniqueId, encrypt, generateRandomNDigits } = require("../helper");
const axios = require("axios").default;
const Secrets = require("../config");
const userEvents = require("../subscribers/user");
const workspaceEvents = require("../subscribers/workspace");
const events = require("../subscribers/events");
const LinkedinService = require("./LinkedinService");
const JWT = require("jsonwebtoken");
const randtoken = require('rand-token');
const { v4: uuidv4 } = require('uuid');



module.exports = class AuthService {
    constructor(userModel) {
      this.userModel = userModel;
    }

    async CreateUser(data) {

        const checkExistingUser = await this.userModel.findOne({ id: data.id });

        if (checkExistingUser) {
            delete checkExistingUser._doc._id;
            delete checkExistingUser._doc.__v;
            return checkExistingUser;
        }

        const userRecord = await this.userModel.create({
            id: data.id,
            nickname: data.nickname,
            referrer: data.referrer
        });

        // await this.accountModel.create({
        //     creator_id: id,
        //     email: data.email
        // });

        delete userRecord._doc._id;
        delete userRecord._doc.__v;

        const user = userRecord;

        //userEvents.dispatch(events.user.signUp, { user: userRecord });
        
        return user;
    }



    async SetUserName() {

        const response = await axios.post(Secrets.LINKEDIN_ACCESS_TOKEN_URL,
          {
            grant_type: "client_credentials",
            client_id: Secrets.LINKEDIN_CLIENT_ID,
            client_secret: Secrets.LINKEDIN_CLIENT_SECRET
          },
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
          }
        )
        console.log(response);
        return response;
    }


    async ValidateUserEmail(data) {
        const userRecord = await this.userModel.findOne({ email: data.email });

        if (!userRecord) {
            let error = new Error("Account doesn't exists.");
            error.statusCode = 400;
            throw error;
        }

        delete userRecord._doc.password;
        delete userRecord._doc.user_type;
        delete userRecord._doc._id;
        delete userRecord._doc.__v;

        const user = {
            name: userRecord.name,
            avatar: userRecord.avatar,
            email: userRecord.email,
            email_verified: userRecord.email_verified,
        };
        return user;
    }



    async Login(data) {
        const userRecord = await this.userModel.findOne({ email: data.email });

        if (!userRecord) {
            let error = new Error("Account doesn't exists.");
            error.statusCode = 400;
            throw error;
        }
        
        const hashedPassword = bcrypt.compareSync(data.password, userRecord.password);

        if(!hashedPassword) {
            let error = new Error("Wrong login details!");
            error.statusCode = 400;
            throw error;
        }

        const jwt_payload = {
            user_id: encrypt(userRecord.user_id.toString()),
            main_id: encrypt(userRecord.main_id.toString()),
            user_email: encrypt(userRecord.email.toString()),
            user_type: encrypt(userRecord.user_type.toString())
        };

        const authorization = JWT.sign(jwt_payload, Secrets.JWT_TOKEN, { expiresIn: "48h" });

        delete userRecord._doc.password;
        delete userRecord._doc.user_type;
        delete userRecord._doc._id;
        delete userRecord._doc.__v;
        userRecord._doc.authorization = authorization;
        userRecord._doc.expires_in = 1200000;
        userRecord._doc.expires_at = 12000000;

        const user = userRecord;
        return user;
    }



    async LoginInWithLinkedin(data) {

        const response = await axios({
            method: "GET",
            url: `${Secrets.LINKEDIN_AUTH_URL}?response_type=code&client_id=${Secrets.LINKEDIN_CLIENT_ID}&redirect_uri=${Secrets.LINKEDIN_REDIRECT_LIVE_URL}&scope=openid%20profile%20email`,
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
        });

        const userRecord = await this.userModel.findOne({ email: data.email });

        if (!userRecord) {
            let error = new Error("Account doesn't exists.");
            error.statusCode = 400;
            throw error;
        }
        
        const hashedPassword = bcrypt.compareSync(data.password, userRecord.password);

        if(!hashedPassword) {
            let error = new Error("Wrong login details!");
            error.statusCode = 400;
            throw error;
        }

        const jwt_payload = {
            user_id: encrypt(userRecord.user_id.toString()),
            main_id: encrypt(userRecord.main_id.toString()),
            user_email: encrypt(userRecord.email.toString()),
            user_type: encrypt(userRecord.user_type.toString())
        };

        const authorization = JWT.sign(jwt_payload, Secrets.JWT_TOKEN, { expiresIn: "3h" });

        delete userRecord._doc.password;
        delete userRecord._doc.user_type;
        delete userRecord._doc._id;
        delete userRecord._doc.__v;
        userRecord._doc.authorization = authorization;
        userRecord._doc.expires_in = 1200000;
        userRecord._doc.expires_at = 12000000;

        const user = userRecord;
        return user;
    }


    async EmailVerified(email) {
        const validStatus = await this.userModel.findOne({ email });

        if (validStatus.email_verified === true) {
            return true;
        }
    }


    async VerifyUserEmail(data, timezone, language) {
        const ts = new Date(); // timestamp
        const checkToken = await this.tokenModel.findOne({ token: data.token, email: data.email });

        if (!checkToken) {
            let error = new Error("Invalid token or expired!");
            error.statusCode = 400;
            throw error;
        }

        await this.InviteType(checkToken.type, data.email)
        //await this.RecoveryType(checkToken.type, data.email);
        await this.EmailVerified(data.email);

        if(checkToken.type === "signup") {
            const update_user = await this.userModel.findOneAndUpdate({ email: data.email }, {
                $set: {
                    email_verified: true,
                    email_verified_at: ts,
                    updated_at: ts
                },
            },
            {
                new: true
            });

            const workspace = await this.workspaceModel.create({ id: await uuidv4(), name: "Default" });
            userEvents.dispatch(events.user.verifyEmail, { user: update_user });
            workspaceEvents.dispatch(events.workspace.createWorkspace, { workspace, creator_id: update_user.user_id, timezone, language });
    
            return workspace;
        }
    }

    // async RecoveryType(type, email) {
    //     if(type === "recovery") {
    //         const userRecord = await this.userModel.findOne({ email });

    //         const jwt_payload = {
    //             user_id: encrypt(userRecord.user_id.toString()),
    //             main_id: encrypt(userRecord.main_id.toString()),
    //             user_email: encrypt(userRecord.email.toString()),
    //             user_type: encrypt(userRecord.user_type.toString())
    //         };
    
    //         const authorization = JWT.sign(jwt_payload, Secrets.JWT_TOKEN, { expiresIn: "3h" });
    
    //         delete userRecord._doc.password;
    //         delete userRecord._doc.user_type;
    //         delete userRecord._doc._id;
    //         delete userRecord._doc.__v;
    //         userRecord._doc.authorization = authorization;
    //         userRecord._doc.expires_in = 1200000;
    //         userRecord._doc.expires_at = 12000000;
    
    //         const user = userRecord;

    //         return user;
    //     }
    // }


    async InviteType(type, data) {
        if(type === "invite") {
            const _password = await bcrypt.hash(data.password, 10);

            const userRecord = await this.userModel.create({
                user_id: await uuidv4(),
                name: data.email,
                email: data.email,
                password: _password,
                refresh_token: randtoken.generate(16)
            });
    
            delete userRecord._doc.password;
            delete userRecord._doc.user_type;
            delete userRecord._doc._id;
            delete userRecord._doc.__v;
    
            const user = userRecord;
            return user;
        }
    }


    async ResetPassword(data) {
        const ts = new Date(); // timestamp
        const checkToken = await this.tokenModel.findOne({ token: data.token, type: "recovery" });
        if (!checkToken) {
            let error = new Error("Invalid token or expired!");
            error.statusCode = 400;
            throw error;
        }
        const _password = await bcrypt.hash(data.password, 10);

        const updateUser = await this.userModel.findOneAndUpdate({ email: checkToken.email }, {
            $set: {
                password: _password,
                refresh_token: randtoken.generate(16),
                updated_at: ts
            },
        },
        {
            new: true
        });
        if (!updateUser) {
            let error = new Error("Could not reset password! Try again!");
            error.statusCode = 400;
            throw error;
        }
    }


    async ForgotPassword(email) {
        const checkExistingUser = await this.userModel.findOne({ email });

        if (!checkExistingUser) {
            let error = new Error("Account does not exists!");
            error.statusCode = 400;
            throw error;
        }

        const otp = generateRandomNDigits(5);

        const token = await this.tokenModel.create({
            id: await uuidv4(),
            email,
            token: otp,
            type: "recovery"
        });

        if (!token) {
            let error = new Error("Could not reset password! Try again!");
            error.statusCode = 400;
            throw error;
        }

        const link = `${Secrets.STAGING_BASE_URL}/auth/email/reset-password?token=${token.token}&type=recovery&redirect_to=/login`;
    
        userEvents.dispatch(events.user.forgotPassword, { email, name: checkExistingUser.name, link });
    }


    async ResendVerifyEmail(email) {
        await this.tokenModel.findOneAndDelete({ email, type: "signup" });

        const otp = generateRandomNDigits(5);

        const token = await this.tokenModel.create({
            id: await uuidv4(),
            email,
            token: otp,
            type: "signup"
        });

        if (!token) {
            let error = new Error("Could not reset password! Try again!");
            error.statusCode = 400;
            throw error;
        }
        const user = await this.userModel.findOne({ email });

        userEvents.dispatch(events.user.resendVerifyEmail, { user, otp: token.token });
    }


    


    async ConnectLinkedin() {
        //const user = await this.userModel.findOne({ email });
        const response = await axios({
            method: "GET",
            url: `${Secrets.LINKEDIN_AUTH_URL}?response_type=code&client_id=${Secrets.LINKEDIN_CLIENT_ID}&redirect_uri=${Secrets.LINKEDIN_REDIRECT_LIVE_URL}&scope=openid%20email%20profile%20r_liteprofile%20r_emailaddress%20w_member_social`,
            //openid email profile w_member_social r_liteprofile r_emailaddress
            headers: {
              //Accept: "x-www-form-urlencoded",
              "Content-Type": "application/x-www-form-urlencoded"
            },
        })

        console.log(response.request.path);
        // if (!user) {
        //     let error = new Error("Account doesn`t exist.");
        //     error.statusCode = 404;
        //     throw error;
        // }
        return { token: response.request.path};
    }


    async GetLinkedinAuthToken(code, email) {

        const ts = new Date(); // timestamp

        const response = await axios({
            method: "POST",
            url: `${Secrets.LINKEDIN_ACCESS_TOKEN_URL}`,
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
                grant_type: "authorization_code",
                code,
                client_id: Secrets.LINKEDIN_CLIENT_ID,
                client_secret: Secrets.LINKEDIN_CLIENT_SECRET,
                redirect_uri: Secrets.LINKEDIN_REDIRECT_LIVE_URL
            }
        })

        const linkedinServiceInstance = new LinkedinService();
        const linkedinProfile = await linkedinServiceInstance.GetLinkedinProfile(response.data.access_token);


        if(!response && !profilePicture) {
            let error = new Error("Could not connect Linkedin");
            error.statusCode = 400;
            throw error;
        }

        const update_user = await this.userModel.update({ 
            status: 1,
            LINKEDIN_ACCESS_TOKEN: response.data.access_token,
            status: "activated",
            first_name: linkedinProfile.firstName,
            last_name: linkedinProfile.lastName,
            picture: linkedinProfile.image,
            linkedin_connected: true,
            updated_at: ts
        }, {
            where: {
               email
            }
        });

        // const update_user = await this.userModel.findOneAndUpdate({email}, {
        //         $set: {
        //             LINKEDIN_ACCESS_TOKEN: response.data.access_token,
        //             status: "activated",
        //             first_name: linkedinProfile.firstName,
        //             last_name: linkedinProfile.lastName,
        //             picture: linkedinProfile.image,
        //             linkedin_connected: true,
        //             updated_at: ts
        //           },
        //     },
        //     {
        //         new: true
        // });


        if(!update_user) {
            let error = new Error("Could not connect Linkedin Token");
            error.statusCode = 400;
            throw error;
        }

        console.log(response.data);
        return { user: update_user };
    }
}