const { UserModelCreate, UserModelLogin } = require("../models/userModelCreate");

const userController ={}

userController.signup = async (req, res) => {
    try {
        // const { name, email, password,role} = req.body;
        const parsedBody = JSON.parse((req.body).toString());
        const { name, email, password, role} = parsedBody;
        const user = await UserModelCreate(name, email, password,role);
        if(user.status === 201){
            res.status(201).send({...user.data,token:user.token})
        }else{
            res.status(user.status).send(user.error)
        }
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal Server Error")
    }
}

userController.login = async (req, res) => {
    try {
        // const { email, password } = req.body;
        const parsedBody = JSON.parse((req.body).toString());
        const { email, password } = parsedBody;
        // Add validation to ensure email and password are provided
        if (!email || !password) {
            return res.status(400).send({
                error: "Email and password are required"
            });
        }
        
        const user = await UserModelLogin(email, password);
        if(user.status === 200){
            res.status(200).send({...user?.data,token:user?.token})
        }else{
            res.status(user.status).send({error:user.error})
        }
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal Server Error")
    }
}

module.exports = userController