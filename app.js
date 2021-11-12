'use strict'

//EN ESTE DOCUMENTO TENEMOS NUESTRA APP PRINCIPAL.
//IMPORTA LAS LIBRERÍAS NECESARIAS PARA FUNCIONAR EL SISTEMA.
//ESTÁ ESTRUCTURADO DE MANERA QUE TIENE EL CARGADO DE LOS DIFERENTES DOCUMENTOS DE LA APLICACIÓN. RUTAS, MIDDLEWARES, CORS, RUTAS, ETC.

var express = require('express');
//Require('express') es la carga del modulo express. Express se utiliza para hacer las conexiones HTTP
var bodyParser = require('body-parser');
//Require('body-parser') es la carga del modulo body-parser. Bodyparser es un middleware que te permite dar formato a los cuerpos antes de que se ejecuten.

var app = express();

//CARGAR ARCHIVOS DE RUTAS
var project_routes = require('./routes/project'); //Este contiene los dos controladores que han sido creados en controllers, pero que estan importados en routes


//MIDDLEWARES
//Middleware es una capa o metodo que se ejecuta antes de la acción de un controlador.

app.use(bodyParser.urlencoded({
    extended: false
})); //Configuracion necesaria para bodyParser
app.use(bodyParser.json()); //Cualquier tipo de petición va a hacer que bodyparser transforme su body a JSON

//CORS
// Configurar cabeceras y cors 
//ESTO ES UN SNIPET DE VICTOR ROBLES, PERMITE QUE PODAMOS HACER PETICIONES FRONTEND A LAS APIS SIN ERRORES.
// https://victorroblesweb.es/2018/01/31/configurar-acceso-cors-en-nodejs/
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//RUTAS
app.use('/', project_routes); //Definimos que las rutas tengan un apartado "/api" antes.
//Si la ruta la quisiéramos tal cual nos viene de los otros archivos, en este caso solo /home o solo /test, el primer parametro de app.use() sería '/', es decir app.use('/', project_routes);

/* 
app.get('/', (req, res) => {
    res.status(200).send( // La respuesta en el estado 200 del servidor es una respuesta exitosa, y aquí decimos cree un h1
        "<h1>Página de inicio</h1>" //En este caso no le pasamos un JSON, sino un texto.
    )
});

app.get('/test', (req, res) => {
    res.status(200).send({ // La respuesta en el estado 200 del servidor es una respuesta exitosa, y aquí decimos que en ese caso mande el mensaje
        message: "Hola mundo desde mi API"
    })
});
*/

//EXPORTAR
module.exports = app; //Exportar el archivo para poderlo implementar en otro sitio