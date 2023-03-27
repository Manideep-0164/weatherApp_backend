const { createClient } = require("redis");

const client = createClient({
    url: 'redis://default:NQYgbkzzivUO4yxTjFd5SXTiiwZIxWLi@redis-19812.c264.ap-south-1-1.ec2.cloud.redislabs.com:19812'
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