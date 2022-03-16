const fs = require('fs')
const axios = require('axios');

const  path = './db/datos.json'

class Find {

    historial = [];

    constructor () {
        // 
        this.readDB()
    };

    get historyCap() {
        return this.historial.map( renglon => {
            let palabras = renglon.split(' ');
            palabras = palabras.map( palabra => palabra[0].toUpperCase() + palabra.substring(1));
            return palabras.join(' ');

        })
    }

    async findPlace (place = '') {
        
        //MAKE HTTP REQUEST
        console.log(place)
        try {

            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json`,
                params: {
                    'access_token': process.env.MAPBOX_KEY,
                    'limit': 5,
                    'language': 'es'
                }
            })
            
            const request = await instance.get();
            return request.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1],
            }))

        } catch (error) {
            console.log('no se encontro nada', error)
            return [];
        }

    };

    async getWeather (lat, lng) {
        try {
            
            const instance = axios.create({
                baseURL: 'https://api.openweathermap.org/data/2.5/weather',
                params: {
                    'lat': lat,
                    'lon': lng,
                    'appid': process.env.OPENWEATHER_KEY,
                    'lang': 'es',
                    'units': 'metric'
                }
            });

            const response = await instance.get();
            
            const {weather, main} = response.data;

            return {
                estado : weather[0].description,
                temperatura : main.temp,
                tempMin: main.temp_min,
                tempMax: main.temp_max
            }
            
        } catch (error) {
            console.log('ALGO SALIO MAL, ERROR: ', error);
        }
    }

    addHistorial (place = '') {
        if (this.historial.includes(place.toLocaleLowerCase())) {
            return; 
        }
        this.historial = this.historial.splice(0,5);
        this.historial.unshift(place.toLocaleLowerCase());
        this.saveDB();
    }

    saveDB () {
        const payload = {
            historial: this.historial
        };
        fs.writeFileSync(path, JSON.stringify( payload ));
    }

    readDB () {
        if (!fs.existsSync(path)) {
            return null
        }
        const file = fs.readFileSync(path, {encoding:'utf-8'})
        const data = JSON.parse( file );
        this.historial = data.historial;
    }

};

module.exports = Find;