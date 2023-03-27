const userRouter = require("express").Router();
require("dotenv").config();
const { userModel } = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {client, LogoutCache} = require("../middlewares/logoutcache.middleware")

//Register
userRouter.post("/register", async (req, res) => {
    const payload = req.body;

    bcrypt.hash(payload.pass, 5, async (err, hash) => {
        try {
            payload.pass = hash;
            const newUser = new userModel(payload);
            await newUser.save();
            res.send({ "msg": "Successfully Registered" });
        }
        catch (err) {

            if (err.keyPattern.email) {
                res.send({ "msg": "User with Email Already Exists" });
                return;
            }
            console.log("Something went wrong", err);
        }

    });
});



// LOGIN
userRouter.post("/login", async (req, res) => {
    const payload = req.body;

    try {
        const user = await userModel.find({ email: payload.email });

        if (user[0] == undefined) {
            res.send({ "msg": "Please Login" });
            return;
        }

        bcrypt.compare(payload.pass, user[0].pass, (err, result) => {
            if (result) {
                const token = jwt.sign({ userid: user._id }, process.env.JWT_SECREAT, { expiresIn: '7d' });
                res.send({ "msg": "Login Success", "token": token });
            }
            else {
                res.send({ "msg": "Wrong Credentials" });
            }
        });

    }
    catch (err) {
        res.send({ "Error": "Something went wrong" });
        console.log(err)
    }
});



//LOGOUT
userRouter.get("/logout",LogoutCache,async (req, res) => {
    const token = req.headers.authorization;
    try {
        const value = await client.lRange("blocklist",0,-1);

        if (value.includes(token)) {
            res.send({ "msg": "Logout Successfull" });
            return;
        }
    }

    catch (err) {
        res.send({ "Error": "Something went wrong" });
        console.log(err)
    }
});

module.exports = {
    userRouter
}