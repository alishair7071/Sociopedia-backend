
import jwt from "jsonwebtoken";

export const verifyToken= async(req, res, next)=>{

    try{

        let token= req.header("Authorization");
        if(!token) return res.status(403).send("Access Denied");

        if(token.startsWith("Bearer ")){
            token= token.slice(7, token.length).trimLeft();
        }

        try {
            const verified = jwt.verify(token, process.env.JWT_SECRET);
            req.user = verified;  // Attach user data to req
            next();  // Proceed to next middleware
        } catch (err) {
            return res.status(401).json({ msg: "Invalid Token" });
        }

    }catch(e){
        res.status(500).json({error: e.message});
    }
}