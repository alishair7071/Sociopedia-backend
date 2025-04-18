import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import userModel from "../models/User.js";


//register user controller
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      imageUrl,
      occupation
    } = req.body;
    const salt= await bcrypt.genSalt();
    const hashedPassword= await bcrypt.hash(password, salt);
    const newUser= new userModel({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        picturePath,
        friends,
        location,
        imageUrl,
        occupation,
        viewedProfile: Math.floor(Math.random() * 10000),
        impressions: Math.floor(Math.random() * 10000),
    });
    const savedUser= await newUser.save();
    res.status(201).json(savedUser);
  } catch (e) {
    console.log(e);
    res.status(500).json({error: e.message});
  }
};

//login user controller
export const login = async (req, res)=>{

    try{

        const {email, password} = req.body;
        const user = await userModel.findOne({email: email});

        if(!user) return res.status(400).json({msg: "User does not exist"});
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({msg: "Invalid Credentials"});

        const token= jwt.sign({id: user._id}, process.env.JWT_SECRET);
        delete user.password;
        res.status(200).json({token, user});
    }catch(e){
    res.status(500).json({error: e.message});

    }
}


