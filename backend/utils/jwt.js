import jwt from 'jsonwebtoken';

const jwToken = (userId,res) => {
    const token = jwt.sign({userId},process.env.JWT_SIGNATURE,
        {
            expiresIn: '1d'
        }
    );
    res.cookie("jwt",token,
        {
            maxAge: 24*60*60*1000,
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.SECURE !== "development"
        }
    );
    return token;
}

export default jwToken;