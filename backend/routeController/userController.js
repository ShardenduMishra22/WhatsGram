import bcryptjs from 'bcryptjs';
import User from '../Models/userModel.js'
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

        console.log(
            "User Created:\n" +
            `ID: ${newUser._id}\n` +
            `Username: ${newUser.username}\n` +
            `Full Name: ${newUser.fullname}\n` +
            `Email: ${newUser.email}\n` +
            `Profile Picture: ${newUser.profilepic}`
        );
          
          
        res.status(201).send({
            success: true,
            _id: newUser._id,
            username: newUser.username,
            fullname: newUser.fullname,
            email: newUser.email,
            profilepic: newUser.profilepic,
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

export const userLogIn = async (req,res) => {
    try{
        const { email, username, password } = req.body;
        
        // Find user by email or username
        const userExist = await User.findOne({
            $or: [
                { email: email },
                { username: username }
            ]
        });

        if (!userExist) {
            console.log("User Not Found");
            return res.status(400).json({
                success: false,
                message: "User Not Found"
            });
        }

        // Compare provided password with stored hashed password
        const comparePass = await bcryptjs.compare(password, userExist.password); 
        
        if (!comparePass) {
            console.log("Password Incorrect");
            return res.status(400).json({
                success: false,
                message: "Password Incorrect"
            });
        }

        // Generate JWT and send response
        jwToken(userExist._id, res);
        
        res.status(200).json({
            _id: userExist._id,
            username: userExist.username,
            fullname: userExist.fullname,
            email: userExist.email,
            message: "User Logged In"
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

export const userLogOut = async (req,res) => {
    try{
        res.cookie("jwt","",{
            maxAge: 0
        })
        res.status(200).send({
            success : true,
            message : "User Logged Out"
        })
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