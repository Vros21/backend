'use strict'

//AQUÍ ESTÁN LAS RUTAS QUE HARÁN QUE SE PUEDAN CONECTAR NUESTROS CONTROLADORES A LA BASE DE DATOS,
///IMPORTA LOS CONTROLLADORES E IMPORTA LA LIBRERÍA EXPRESS PARA PODER HACER LAS CONEXIONES HTTP CON LA BASE DE DATOS.

var express = require('express'); // Importar express con el require
var ProjectController = require('../controllers/project'); //Importar el controlador que hemos creado en controller con el require

//---------- ARREGLAR EL CONNECT MULTIPARTY AÑADIENDO ESTA LIBRERIA. ----------
var crypto = require('crypto')
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/albums/')
    },
    filename: function (req, file, cb) {
        cb(null, "user" + Date.now() + file.originalname);
    }
});

const upload = multer({
    storage: storage
});

//---------- ARREGLAR EL CONNECT MULTIPARTY AÑADIENDO ESTA LIBRERIA. ----------

//MIDDLEWARE --> EL MIDDLEWARE ES CODIGO QUE SE EJECUTA ANTES DE LA EJECUCION PRINCIPAL DEL METODO
//PARA QUE EL MIDDLEWARE FUNCIONE, EN ESTE CASO EL MULTIPART, TENEMOS QUE PASARLE AL PARAMETRO LA FUNCIÓN DEL MIDDLEWARE, COMO HEMOS HECHO MAS ABAJO CON EL METODO POST DE LAS IMAGENES. IMPORTANTE.
// var multipart = require('connect-multiparty'); //HEMOS TRAIDO LA LIBRERIA MULTIPART PARA PODER HACER INTERCAMBIOS CON LA BASE DE DATOS CON ARCHIVOS, NO SOLO CON DATOS, YA QUE SIN ESTO, DIRECTAMENTE NO FUNCIONA.
// var multipartMiddleware = multipart({ //LE DECIMOS QUE SUBA UN ARCHIVO EN LA CARPETA QUE HEMOS CREADO LLAMADA UPLOADS
//     uploadDir: './uploads'
// });

//RUTAS --> En el curso, las utilizamos para introducirlas en el cliente POSTMAN para poder interactuar con la base de datos de MongoDB
var router = express.Router(); //Para acceder a las rutas.
router.get('/home', ProjectController.home); //Cargamos el controlador HOME del controlador en modo GET.
router.post('/test', ProjectController.test); //Cargamos el controlador TEST del controlador en modo POST.
router.post('/save-project', ProjectController.saveProject); //Cargamos el controlador saveProject para guardar los proyectos del consolador en modo POST.
router.get('/project/:id?', ProjectController.getProject); //El '/project:id?' quiere decir que nos pase la id, pero es opcional, es decir, que si no lo tiene no nos lo envía. Si se lo ponemos opcional hay que hacer la condicion if(projectID == null) en el metodo getProject en controllers.
router.get('/projects', ProjectController.getProjects); //Cargamos el controlador Projects del controlador en moto GET. 
router.put('/project/:id', ProjectController.updateProject); //Este método de updateProject necesita una llamada en modo PUT para funcionar, y en este caso es necesario pasarle el :id por parametro
router.delete('/project/:id', ProjectController.deleteProject); //Este método de removePRoject necesita una llamada en modo DELETE para funcionar, y en este caso es necesario pasarle el :id por parametro
//router.post('/upload-image/:id', multipartMiddleware, ProjectController.uploadImage);
router.post('/upload-image/:id', upload.single('image'), ProjectController.uploadImage);

//Este método para subir archivos necesita de un middleware, el multipart, que lo hemos incorporado más arriba para usarlo.
//Para ello le hemos pasado por parametro la variable que contiene la ejecución de guardado de archivos dentro de la carpeta uploads.
//Estamos hablando, de que en postman estamos subiendo un archivo en el apartado body --> form-data --> una columna de "image", como el esquema de nuestro modelo, y como valor un buscador url de ruta para cargar nuestra foto y que esta se suba así a la BBDD
router.get('/get-image/:image', ProjectController.getImageFile);
//Ruta tipo get, en la que le pasamos el parametro imagen para identificarlo.

module.exports = router; //Exportar