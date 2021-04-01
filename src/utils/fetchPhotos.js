const Axios = require('axios')

const fetchPhotos = async (url) => {
    try {
        const {data} = await Axios.get(url)   
        const photosData= data.photos.photo
        return photosData.length ===0?photosData:
            photosData.filter(photoData=> photoData.url_m!=undefined)
            .map(photoData=>({url:photoData.url_m,alt:photoData.title,id: photoData.id}))
    } catch (err) {
        throw err
    }
}

module.exports = fetchPhotos
