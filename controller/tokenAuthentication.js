const jwt = require('jsonwebtoken');

const tokenAuthentication = (req, res, next) => {
    try {
        const tokenheader= req.headers['authorization'];
        if(!tokenheader){
            return res.status(401).send({error:"Unauthorized"})
        }
        jwt.verify(tokenheader, process.env.JWT_SECRET,(err,user)=>{
            if(err){
                return res.status(401).send({error:"Unauthorized"})
            }
            req.user = user;
            next();
        });
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal Server Error")
    }
}

module.exports = tokenAuthentication;