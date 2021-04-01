const express = require("express");
const { getPhotosFromRedis } = require("../middleware/redis");
const fetchPhotos = require("../utils/fetchPhotos");
const redisClient = require('../db/redis');


const key = process.env.FLICKR_API;
const interestingPhotosURL = `https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=${key}&format=json&nojsoncallback=1&extras=url_m&safesearch=1`;
const searchPhotoUrl = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${key}&format=json&nojsoncallback=1&extras=url_m&safesearch=1&text=`;

const router = new express.Router();
router.get("/search-photos/:search",getPhotosFromRedis, async (req, res) => {
    try {
        const photos = await fetchPhotos(searchPhotoUrl+ req.params.search);
        if (photos.length > 0) {
            redisClient.setexAsync(
                "search:" + req.params.search,
                300,
                JSON.stringify(photos)
            );
        }
        res.send(photos);
    } catch (err) {
        res.status(500).send();
    }
});
router.get('/get-search-suggestions/:search', async (req, res) => {
    const searchValue = req.params.search;
    try {
        let suggestions = await redisClient.keysAsync("search:*" + searchValue + "*");
        suggestions = suggestions ? suggestions.map(suggestion => suggestion.split(":")[1]) : [];
        res.send(suggestions);
    } catch (err) {
        console.log(err);
    }
});

module.exports=router