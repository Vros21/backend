'use strict'

var params = process.argv.slice(2); //Este comando recoge los parametros que le pasamos desde la consola por cygdrive con el comando node, en este caso "node calculadora.js 1 2 3";
//El 2 dentro del slice se refiere a la cantidad de parametros que quieres que la calculadora te devuelve, siendo 1 la ruta del archivo, mientras que en 2 empieza a mostrarte lo que hay en el comando del codigo, en el caso anterior, con el slice a 2 te muestra ['1','2','3']

var numero1 = parseFloat(params[0]); // El primer valor que le introduces por consola, en el caso anterior sería 1
var numero2 = parseFloat(params[1]); // El segundo valor que le introduces por consola, en el caso anterior sería 2

var plantilla = `
La suma es: ${numero1} + ${numero2}
`; // Nos saca la suma de los dos primeros parametros que le hemos pasado.
console.log(params);
console.log("Hola mundo")