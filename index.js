const express = require("express");
const app = express();
const { connection } = require("./config/db")
const { userRouter } = require("./routes/user.router");
const {LogoutCache, client} = require("./middlewares/logoutcache.middleware")
require("dotenv").config();

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).send("working...");
});




app.use("/user", userRouter);











const port = process.env.PORT || 1200;

app.listen(port, async () => {
    try {
        await connection;
        await client.connect();
        console.log("Connected to DB")
    }
    catch (err) {
        console.log(err)
    }
    console.log(`Server is running at port ${port}`);
})