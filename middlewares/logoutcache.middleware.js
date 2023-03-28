const { createClient } = require("redis");
require('dotenv').config();


const client = createClient({
    url: process.env.redisURL
});

client.on('error', err => console.log('Redis Client Error', err));

const LogoutCache = async (req, res, next) => {

    const token = req.headers.authorization;

    if (token) {
        await client.lPush("blocklist",`${token}`);
        next();
    }
    else {
        res.send({ "msg": "Please Login first" });
    }



}

module.exports = {
    LogoutCache,
    client
}