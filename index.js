#! /usr/bin/env node

var Horseman = require('node-horseman');
var horseman = new Horseman({loadImages:false, timeout: 60000});
var spinner = require('@exponent/simple-spinner');
var download = require('download');
var fs = require('fs');
require("colors");

var date = process.argv[2];

if(!date) {
  console.log('Voce precisa informar uma data nesse formato DD/MM/YYYY'.red);
  process.exit();
} 

var pdf;

horseman
  .userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0')
  .log("Consultando TJPA na data ".green + date.blue + "...".green )
  .then(() => spinner.start())
  .post('http://dje.tjpa.jus.br/dje_consulta/consultarDiario.do', "data=" + date)
  .then(() => spinner.stop())
  .evaluate(function() { return $($("#pageBox1 p a")[1]).attr("href") })
  .then(x => {
     pdf = "http://dje.tjpa.jus.br" + x;
     console.log("Achei o documento para donwload: ".green + pdf.blue);
   })
  .log("Downloading...".green)
  .then(() => spinner.start())
  .then(() => download(pdf))
  .then((data) => fs.writeFileSync(date.replace(/\//g, "") + '.pdf', data))
  .then(() => spinner.stop())
  .then(() => process.exit());