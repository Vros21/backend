'use strict'

//AQUÍ ESTAN TODOS LOS METODOS QUE HACEN LAS DIFERENTES CONEXIONES REST.
//IMPORTA EL MODELO DE ESQUEMA QUE QUIERO IMPLEMENTAR EN LA BASE DE DATOS DE "MODELS"

var Project = require('../models/project')
var fs = require('fs'); //LIBRERIA PARA BORRAR EL ARCHIVO SI SE SUBE Y NO TIENE LA EXTENSIÓN ADECUADA
var path = require('path'); // LIBRERÍA QUE IMPORTA EL OBJETO PATH, QUE PERMITE CARGAR RUTAS FISICAS EN  NUESTRO SISTEMA DE ARCHIVOS
const {
    send
} = require('process');



var controller = {
    home: function (req, res) {
        return res.status(200).send({
            message: 'Soy la home.'
        });
    },

    test: function (req, res) {
        return res.status(200).send({
            message: 'Soy el método o accion test del controlador de project.'
        });
    },

    //GUARDAR EL PROYECTO DE TIPO PROYECTO
    saveProject: function (req, res) {
        var project = new Project();
        var params = req.body;

        project.name = params.name;
        project.description = params.description;
        project.category = params.category;
        project.year = params.year;
        project.langs = params.langs;
        project.image = null;

        project.save((err, projectStored) => {
            if (err) return res.status(500).send({
                message: 'Error al guardar el documento'
            });
            if (!projectStored) return res.status(404).send({
                message: 'No se ha podido guardar el documento'
            });
            return res.status(200).send({
                project: projectStored
            }); //Si solo pones projectStored te crea una variable nueva, entonces hay que indicarla.
        });
    },

    //COGER LOS DATOS DE UN PROYECTO YA GUARDADO
    getProject: function (req, res) {
        var projectID = req.params.id;

        if (projectID == null) { //ESTA ES LA CONDICIÓN QUE DEBE EXISTIR AQUÍ EN CASO DE QUE EL ID SEA NULL, YA QUE EN LA RUTA LE HEMOS INDICADO QUE EL ID ES OPCIONAL. '/project:id?'
            return res.status(404).send({
                message: 'El proyecto no existe.'
            })
        }
        Project.findById(projectID, (err, project) => {
            if (err) return res.status(500).send({
                message: 'Error al devolver los datos'
            });
            if (!project) return res.status(404).send({
                message: 'El proyecto no existe.'
            });

            return res.status(200).send({
                project
            })
        });
    },

    //COGER LOS DATOS DE TODOS LOS PROYECTOS GUARDADOS
    getProjects: function (req, res) {
        Project.find({}).sort('-year').exec((err, projects) => { // Al ponerle Project.find sin parametros nos va a devolver con todos los proyectos, porque no tiene filtro. Exec es una funcion de callback que hace ejecutar lo siguiente.
            //El metodo .sort('-year) ordena de menor a mayor por orden de año
            if (err) return res.status(500).send({
                message: 'Error al devolver los datos,'
            });
            if (!projects) return res.status(404).send({
                message: 'No hay proyectos que mostrar'
            });

            return res.status(200).send({
                projects
            });
        })
    },

    updateProject: function (req, res) {
        var projectID = req.params.id; //Recoge el id del proyecto que se quiere buscar
        var update = req.body; //Recogemos todos los datos completos del objeto, con los parametros y sus valores, actualizados porque luego queremos coger esos valores y modificar los de nuestra base de datos.
        //Es decir, cogemos los valores del postman que queremos modificar para luego pisarlos en la base de datos y así actualizarlos.

        Project.findByIdAndUpdate(projectID, update, { //El parametro update hace que si ve un elemento diferente, lo sustituye.
            new: true
            //EN EL POSTMAN, TE DEVOLVERÁ EL DOCUMENTO VIEJO, PERO SI ENTRAMOS DE NUEVO EN LA BASE DE DATOS VEREMOS QUE EL DOCUMENTO HA SIDO MODIFICADO
            //ES POR ELLO QUE PARA QUE NOS APAREZCA EL DOCUMENTO MODIFICADO EN EL POSTMAN, DEBEREMOS METERLE new:true COMO PARAMETRO
        }, (err, projectUpdated) => { //Este metodo actualiza la base de datos con el objeto que le hemos pasado, que en nuestro caso viene de postman.

            if (err) return res.status(500).send({
                message: 'Error al actualizar.'
            });

            if (!projectUpdated) return res.status(404).send({
                message: 'No se ha podido actualizar el proyecto.'
            });

            return res.status(200).send({
                project: projectUpdated
            })
        })
    },

    deleteProject: function (req, res) { //Igual que el anterior pero borrando documentos.
        var projectID = req.params.id;

        Project.findByIdAndRemove(projectID, (err, projectRemoved) => {
            if (err) return res.status(500).send({
                message: 'No se ha podido borrar el proyecto'
            })

            if (!projectRemoved) return res.status(404).send({
                message: 'No se ha podido actualizar el proyecto.'
            });

            return res.status(200).send({
                project: projectRemoved
            })
        })
    },


    uploadImage: function (req, res) {

        var projectID = req.params.id;
        var fileName = 'Imagen no subida'; //Mensaje en caso de que no se haya podido subir
        if (req.file) {
            //SACAMOS EL NOMBRE ENTERO DEL ARCHIVO
            var filePath = req.file.path; //La ruta de la imagen subida desde alla donde se carga con la finalidad de coger el nombre en las proximas variables 
            var fileSplit = filePath.split('\\'); //Separamos la ruta para que solo nos quede el nombre de la imagen
            var fileName = fileSplit[fileSplit.length - 1]; //Cogemos el nombre y lo guardamos
            //SACAMOS LA EXTENSION DEL ARCHIVO
            var extSplit = fileName.split('\.');
            var fileExt = extSplit[1];

            if (fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif') { //EN CASO DE QUE LA EXTENSIÓN DEL ARCHIVO ESTE BIEN
                Project.findByIdAndUpdate(projectID, {
                    image: fileName //Nombre de la imagen
                }, {
                    new: true //Para que postman nos enseñe el objeto ya modificado
                }, (err, projectUpdated) => {
                    if (err) return res.status(500).send({
                        message: 'La imagen no se ha subido'
                    });
                    if (!projectUpdated) return res.status(404).send({
                        message: 'El proyecto no existe y no se le ha asignado la imagen'
                    });
                    return res.status(200).send({
                        project: projectUpdated
                    });
                });
            } else { //EN CASO DE QUE LA EXTENSIÓN NO SEA LA ADECUADA, CON EL FS.UNLINK NOS BORRARA EL ARCHIVO Y NO NOS PERMITIRÁ SUBIRLO
                fs.unlink(filePath, (err) => {
                    return res.status(200).send({
                        message: 'La extensión no es válida.'
                    });
                });
            }
        } else {
            return res.status(200).send({
                message: fileName
            })
        }
        /*
        if (req.file) {
            // console.log(req.file);
            var file_path = req.file.path;
            var file_split = file_path.split('\\');
            var file_name = file_split[2];
            var ext_split = req.file.originalname.split('\.');
            var file_ext = ext_split[1]
            if (file_ext == 'png' || file_ext == 'gif' || file_ext == 'jpg') {
                Project.findByIdAndUpdate(projectID, {
                    image: file_name
                }, (err, projectUpdated) => {
                    if (!projectUpdated) {
                        res.status(404).send({
                            message: 'No se ha podido actualizar el album'
                        });
                    } else {
                        res.status(200).send({
                            project: projectUpdated
                        });
                    }
                })
            } else {
                res.status(200).send({
                    message: 'Extension del archivo no valida'
                });
            }
            console.log(file_path);
        } else {
            res.status(200).send({
                message: 'No has subido ninguna imagen..'
            });
        }
        */
    },

    getImageFile: function (req, res) {
        var file = req.params.image; //El nombre del archivo que se lo pasamos por la url, como propiedad del parametro de nuestra ruta.
        var path_file = './uploads/albums/' + file; //Ruta + nombre de archivo

        fs.exists(path_file, (exists) => { //Comprobamos si existe el path del archivo, usando la librería fs, que hemos cargado en este archivo. Si existe el path, entonces le pasamos una funcion callback con la variable exists.
            if (exists) { //Si existe el path, hacer esto.
                return res.sendFile(path.resolve(path_file)); //Si existe, de volver (con res) el metodo sendFile que le enviamos el path_file, que es la ruta.
                //El objeto path lo tenemos que improtar de una libería
            } else {
                return res.status(200).send({
                    message: "No existe la imagen..."
                });
            }
        });
    }
};

module.exports = controller;