'use strict'

//ESTE DOCUMENTO HACE EL CÓDIGO PARA LA CONEXIÓN DE LA APLICACIÓN CON LA BASE DE DATOS A RAIZ DE UNA PROMISE.
//IMPORTA LAS LIBRERÍAS NECESARIAS PARA ELLO, COMO MONGOOSE Y APP (QUE CONTIENE EL METODO EXPRESS).

var mongoose = require('mongoose');
var app = require('./app'); // Importar el objeto app donde esta el listen (¿EXPRESS?)
var port = 3700; //Puerto del servidor

mongoose.Promise = global.Promise; // Hay que indicarle que es una promesa, en concreto la global
mongoose.connect('mongodb://localhost:27017/portafolio')
    .then(() => {
        console.log("Conexión a la base de datos establecida con exito.")

        //Creación del servidor
        app.listen(port, () => { //Escuchar al puerto 3700
            console.log("Servidor corriendo correctamente en la URL localhost:3700");
        });
    })
    .catch(err => console.log(err)) //Para comprobar si se ha conectado a la base de datos