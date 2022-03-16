const { green } = require('colors');
const inquirer = require('inquirer');

require('colors');

const preguntas = [
    {
        type: 'list',
        name: 'opcion',
        message: '¿Qué desea hacer?',
        choices: [{
            value: 1,
            name: `${'1'.green}. Buscar ciudad`
        },
        {
            value: 2,
            name: `${'2'.green}. Historial`
        },
        {
            value: 0,
            name: `${'0'.green}. Salir`
        }
    ]
    }
];

const inquirerMenu = async ()=>{  //muestra el menu inicial
    console.clear();
    console.log("==========================".green);
    console.log("  Seleccione una opción".green);
    console.log("==========================".green);

    const {opcion} = await inquirer.prompt(preguntas);

    return opcion; //la opción recoge el valor seleccionado por el usuario  
}

const pausa = async ()  => { 

    question = [
        {
            type: 'input', //con esto se espera un input, en este caso el enter para continuar
            name: 'enter',
            message: `Presione ${'enter'.green} para continuar`
        }
    ]
    await inquirer.prompt(question);
    
};

const inputPlace = async (mensaje)=> { //input a new task
    question = [
        {
            type: 'input',
            name: 'place',
            message: mensaje, //aca se establece el mensaje que se desea preguntar al usuario
            validate ( value ) { //con esto se valida que al menos escriban algo
                if (value.length === 0 ) {
                    return 'Por ingrese un valor';
                }
                return true; //al retornar un true la validación pasa
            }
        }
    ];
    const {place} = await inquirer.prompt(question); //tareaIngresada recoge el valor

    return place;
};

const choicePlace = async(opciones = []) => {

    const choices = opciones.map((place, id)=> {
        const idx = `${id + 1}.`.green
        return {
            value: place.id,
            name: `${idx} ${place.nombre}` 
        }
    })
    //console.log('las eleciones son::::', choices)
    choices.unshift({
        value: '0',
        name: `${'0.'.green} CANCELAR`
    })
    const question = [
        {
            type: 'list',
            name: 'selectedPlaceId',
            message: 'Elige el lugar:',
            choices: choices
        }
    ]

    //console.log('preguntas:::::', question)
    const {selectedPlaceId} = await inquirer.prompt(question);
    //console.log('El valor a borrar es', borrar)
    return selectedPlaceId;

}


module.exports = { 
    inquirerMenu,
    pausa,
    inputPlace,
    choicePlace,
}