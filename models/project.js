'use strict'


//AQUÍ ESTÁ EL ESQUEMA DE LOS DOCUMENTOS QUE QUEREMOS GUARDAR EN LA BASE DE DATOS,
//IMPORTA LA LIBRERIA MONGOOSE PARA CONECTARSE A LA BASE DE DATOS, PARA QUE EL OBJETO SEA DE TIPO ESQUEMA DE MONGO

var mongoose = require('mongoose'); //Para usar mongoose.
var Schema = mongoose.Schema; //Para crear el esquema

var ProjectSchema = Schema({
    name: String,
    description: String,
    category: String,
    year: Number,
    langs: String,
    image: String
});

module.exports = mongoose.model('Project', ProjectSchema);
//Para exportar este esquema necesitamos usar el método model.
//Dentro de model, como parametro le pasamos el nombre al que guardara Mongoose este documento, y el segundo parametro que variable o esquema le estas pasando para que envíe.
//Si el documento en Mongoose no esta creado, Mongoose lo pondrá en letras singulares y plurales, es decir, en este caso sería "projects", por tanto se me guardaría. En caso de no existir, crearía "projects"