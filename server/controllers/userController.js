import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs"
import cloudinary from "../lib/cloudinary.js";


// Sign up a new user
export const signup = async (req, res)=> {
    const { fullName, email, password, bio} = req.body;

    try{
        if(!fullName || !email || !password || !bio){
            return res.json({success: false, message: "Missing Details" })
        }
        const user = await User.findOne({email});

        if(user){
            return res.json({success: false, message: "Account already exists"})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = await User.create({
            fullName, email, password: hashedPassword, bio
        });

        const token = generateToken(newUser._id);

        res.json({success: true, newUser, token, message: "Account created successfull"})
    }
    catch (error){
        console.log(error.message);
        res.json({success: false, message: error.message})
    }

}

//controller to login a user
export const login = async (req, res) => {
    try{
        const {  email, password } = req.body;
        const userDate = User.findOne({email});

        const isPasswordCorrect = await bcrypt.compare(password, userDate.password);

        if ( !isPasswordCorrect ){
            return res.json({success: false, message: "Invalid credentials"});
        }

        const token = generateToken(newUser._id);

        res.json({success: true, newUser, token, message: "Login successfull"})


    }catch(error){
        console.log(error.message);
        res.json({status:false, message: error.message});
    }
}

//controller to check if the user is authenticated 
export const checkAuth  = (req, res) => {
    res.json({success: true, user: req.user});
}

//Controller to update user profile details
export const updateProfile = async (req, res) => {
    try {
        const  { profilePic, bio, fullName } = req.body;

        const userId = req.user._id;
        let updateUser;

        if(!profilePic){
            updateUser = await User.findByIdAndUpdate(userId, {bio, fullName}, {new:true})
        }else{
            const upload = await cloudinary.uploader.upload(profilePic)

            updateUser = await User.findByIdAndUpdate(userId, {profilePic: upload.secure_url, bio, fullName}, {new: true});
        }
        res.json({success: true, user: updateUser})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, user: error.message})
    }
}
