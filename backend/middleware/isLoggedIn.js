import jwt from 'jsonwebtoken';
import User from '../Models/userModel.js';

const IsLoggedIn = async (req,res,next) => {
    try{
        // u ask for a token form the cookies stored
        const token = req.cookies.jwt;

        // if therre is no such token means 
        // user is not logged in
        if(!token){
            return res.status(500).json({
                success: false,
                message: "You are not logged in"
            })
        }

        // if there is a token then we will verify it
        const decode = jwt.verify(token,process.env.JWT_SIGNATURE);
        
        // the token he provided is not valid
        if(!decode){
            return res.status(500).json({
                success: false,
                message: "Invalid Token"
            })
        }

        // if the token is valid then we will find the user
        const user = await User.findById(decode.userId).select("-password");
        // .select("-password") will make sure that 
        // password or even hashedPassword of the user is not stored anywhere in token 

        // if there is no such user return the session
        if(!user){
            return res.status(500).json({
                success: false,
                message: "User Not Found"
            })
        }

        // we are sure there is an authenticated user 
        req.user = user

        next();

    }catch(error){
        console.log(`error in isLogin middleware ${error.message}`);
        res.status(500).send({
            success: false,
            message: error
        })
    }
}

export default IsLoggedIn;