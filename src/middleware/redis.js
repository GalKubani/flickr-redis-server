const redisClient = require('../db/redis');

const getPhotosFromRedis = async (req, res, next) => {
    try {
        console.log(req.params.search)
        const photos = await redisClient.getAsync("search:" + req.params.search);
        if (photos) {
            res.send(photos);
        }
        else next();
    } catch (err) {
        console.log(err);
    }
};


module.exports = {
    getPhotosFromRedis
};