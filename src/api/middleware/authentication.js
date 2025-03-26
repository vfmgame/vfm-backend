const jwt = require("jsonwebtoken");
const { decrypt } = require("../../helper");
const Secrets = require("../../config");


module.exports = (req, res, next) => {
    try {
        let auth = req.headers["authorization"] ? req.headers["authorization"] : req.headers["Authorization"];
        let timezone = req.headers["timezone"] ? req.headers["timezone"] : req.headers["Timezone"];
        let token = auth && auth.split(" ").length === 2 ? auth.split(" ")[1] : null;
        if(token) {
            jwt.verify(token, "example", (err, decoded) => {
                if(!err) {
                    let user = decoded;
                    if(user && user.user_id) {
                        user.user_id = decrypt(user.user_id);
                        user.timezone = timezone;
                        req["user"] = user;
                        next();
                    } else {
                        let error = new Error("Invalid token 1");
                        error.statusCode = 401;
                        error.statusText = "Invalid user"
                        throw error;
                    }
                } else {
                    let error = new Error("Invalid token 2");
                    error.statusCode = 401;
                    error.statusText = "Token error"
                    throw error;
                }
            })
        } else {
            let error = new Error("Invalid token 3");
            error.statusCode = 401;
            error.statusText = "No token"
            throw error;
        }
    } catch (error) {
        let err = new Error("Invalid token 4");
        err.statusCode = 401;
        err.statusText = error
        throw err;
    }
}