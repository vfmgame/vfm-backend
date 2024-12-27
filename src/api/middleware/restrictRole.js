const restrictRole = (...roles) => {
    return (req, res, next) => {
      const { user } = req.body;
      if (!roles.includes(user.user_type)) {
        let error = new Error("You do not have permission!");
        error.statusCode = 400;
        throw error;
      }
      next();
    };
};

module.exports = restrictRole; 
