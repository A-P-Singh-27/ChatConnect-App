const jwt = require('jsonwebtoken');
const user = require('../Models/userModel');
require('dotenv').config();

exports.protect = async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            // console.log({token});

            token = req.headers.authorization.split(" ")[1];

            // decode token id
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            
            req.user = await user.findById(decode.id).select("-password");
            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Something went wront in auth21'
            })
        }
    }
    if (!token) {
        res.status(400).json({
            success: false,
            message: 'Something went wrong in auth 28'
        })
    }
}