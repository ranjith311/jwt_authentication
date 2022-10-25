
const jwt = require("jsonwebtoken");
const check_jwt = (req, res, next) => {
    try {
        const token =  req.cookies.jwt
         if (token) {
            jwt.verify(token, process.env.JWT_SECRET_KEY)
            next()
        } else {
            console.log("No cookies found")
            res.redirect("/api/login")
        }
    } catch (error) {
        console.log(error.message)
        res.redirect("/api/login")
    }
}

module.exports = check_jwt
