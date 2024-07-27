import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;
const API_KEY = '8edc9ad0d1add16511f788aca04bcf2d';
const GEO_API_URL = 'http://api.openweathermap.org/geo/1.0/direct';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

app.use(express.static('public'))
app.use(bodyParser.urlencoded( {extended: true} ))

app.get('/', (req, res) => {
    res.render('index.ejs');
})

app.post('/submit', async (req, res) => {
    
    try {
        const coordinates = await getCoordinates(req.body.city);
        const weather = await getWeather(coordinates);
        res.render('index.ejs', { data: weather })
    } catch (error) {
        res.render('index.ejs', {error: 'Location is not available' })
    }
})


app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
})

async function getCoordinates ( city ) {
    try {
        const config = { params: { q: city, appid: API_KEY } }
        const response = await axios.get(GEO_API_URL, config);
        const result = response.data;

        const coordinates = {
            longitude: result[0].lon,
            latitude: result[0].lat
        }

        return coordinates;

    } catch (error) { throw error }
    
}

async function getWeather ( coordinates ) {
    try {
        const config = { params: { lat: coordinates.latitude, lon: coordinates.longitude, appid: API_KEY } }
        const response = await axios.get(WEATHER_API_URL, config);
        const result = response.data;
        
        const details = {
            weather: {
                main: result.weather[0].main,
                description: result.weather[0].description
            },
            temp: result.main.temp,
            humidity: result.main.humidity
        }

        return details;
        
    } catch (error) { throw error }
}