require('dotenv').config();

const {inquirerMenu, pausa, inputPlace, choicePlace} = require('./helpers/inquirer');

const Find = require('./models/find');

const main = async () => {

    let opcion = '';

    const find = new Find();

    do {
        opcion = await inquirerMenu();
        
        switch (opcion) {
            case 1:
                //show message, type place
                const userPlace = await inputPlace("Escriba el lugar que desea buscar:")
                //find places

                const places = await find.findPlace(userPlace);

                //user select place
                const selectedPlaceId = await choicePlace(places);
                if (selectedPlaceId === '0') continue;

                const place = places.find(lugar => lugar.id === selectedPlaceId);

                //add place to historial
                find.addHistorial(place.nombre);

                //weather
                const arreglo = await find.getWeather(place.lat, place.lng)
                
                //show results
                console.log('\n Información de la Ciudad \n'.green, `Estado: ${arreglo.estado}`.blue);
                console.log('Ciudad: ', place.nombre);
                console.log('Lat: ', place.lat);
                console.log('Lng: ', place.lng);
                console.log('Temperatura: ', arreglo.temperatura);
                console.log('Mínima: ', arreglo.tempMin);
                console.log('Máxima: ', arreglo.tempMax);
            break;

            case 2:
                find.historyCap.forEach((lugar, id)=>{
                    const idx = `${id + 1}.`.green
                    console.log(idx, `${lugar}`.yellow)
                })
            break;
        }



        if (opcion!== 0) await pausa();
        
    } while (opcion !== 0)
};


main();