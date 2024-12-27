const jwt = require("jsonwebtoken");
const { decrypt } = require("../../helper");
const Secrets = require("../../config");


module.exports = (req, res, next) => {
    try {
        let workspace = "";
        let auth = req.headers["authorization"] ? req.headers["authorization"] : req.headers["Authorization"];
        workspace = req.headers["workspaceid"] ? req.headers["workspaceid"] : req.headers["WorkspaceID"];
        let timezone = req.headers["timezone"] ? req.headers["timezone"] : req.headers["Timezone"];
        let token = auth && auth.split(" ").length === 2 ? auth.split(" ")[1] : null;
        if(token) {
            jwt.verify(token, Secrets.JWT_TOKEN, (err, decoded) => {
                if(!err) {
                    let user = decoded;
                    if(user && user.user_email && user.user_id && user.main_id && user.user_type) {
                        user.user_id = decrypt(user.user_id);
                        user.main_id = decrypt(user.main_id);
                        user.user_email = decrypt(user.user_email);
                        user.user_type = decrypt(user.user_type);
                        user.workspace = workspace;
                        user.timezone = timezone;
                        req.body["user"] = user;
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