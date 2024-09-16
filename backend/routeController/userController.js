import bcryptjs from 'bcryptjs';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import jwToken from '../utils/jwt.js';

export const userRegister = async (req,res) => {    
    try{ 
        // we can instead just deconstruct array 
        // but in that we will have to keep the order 
        // of inputs in mind so i did it like this 
        
        const UserBody = req.body;
        
        const fullname = UserBody.fullname;
        const username = UserBody.username;
        const email = UserBody.email;
        const password = UserBody.password;
        const gender = UserBody.gender;
        const profilepic = UserBody.profilepic;


        // User = await User......... 
        // this will give an error because 
        // "User" is exported by schema 
        const user = await User.findOne(
            {
                $or : [
                    {email : email},
                    {username : username},
                ]
            }
        )
        
        if(user){
            console.log("The User Already Exists");
            return res.status(400).json({
                success: false,
                message: "The User Already Exists"
            });
        }

        const hashedPassword = await bcryptjs.hash(password,10);
        // or use const hashedPassword = bcryptjs.hashSync(password,10)
        
        const profileBoy = profilepic || `https://avatar.iran.liara.run/public/boy?username=${username}`
        const profileGirl = profilepic || `https://avatar.iran.liara.run/public/girl?username=${username}`

        const newUser = new User(
            {
                username : username,
                fullname : fullname,
                password : hashedPassword,
                email : email,
                gender : gender,
                profilepic : gender == "male" ? profileBoy : profileGirl
            }
        )

        if(newUser){
            await newUser.save()
        }else{
            console.log("User Not Created");
            return res.status(400).json({
                success: false,
                message: "User Not Created"
            });
        }

        res.status(201).send({
            _id : newUser._id,
            username : newUser.username,
            fullname : newUser.fullname,
            email : newUser.email,
            profilepic : newUser.profilepic,
        });

    }catch(error){
        console.error(error);
        res
            .status(500)
            .send({
                success : false,
                message : "Internal Server Error"
            })
        process.exit(1);
        // process.exit(1) will stop the server
        // if we didnt get the server whats the
        // point of keeping the server alive 
    }
}

export const userLogin = async (req,res) => {}