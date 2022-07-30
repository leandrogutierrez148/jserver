//init 
const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults() 
const axios = require('axios');
const controllers = { }; // better would be to have module create an object
const jsonserver = 'http://localhost:3001/';

server.use(middlewares)
server.use(router)
server.listen(3001, () => {
  console.log('JSON Server is running')
})

var bodyParser = require("body-parser");
var express = require('express');
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, autorization,content-type');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    next(); 
});

app.get ('/:controller', function(req,res){
  let controller = req.params.controller;
  controllers[controller]['buscar'](req,res);
});

app.get('/:controller/:id', function (req, res) {
  let controller = req.params.controller;
  controllers[controller]['dame'](req,res);
});

app.post('/:controller/:action/', function (req, res) {
  let controller = req.params.controller;
  let action = req.params.action;
  controllers[controller][action](req,res)
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

controllers.usuarios = {};
controllers.juzgados = {};

controllers.usuarios.existe = function (req, res) {
    axios.get(jsonserver + 'usuarios?', {
        params: {
          Usuario: req.body.Usuario
        }
        })
        .then(response => {
          data = JSON.stringify(response.data);
          let error = { Error: "Usuario inexistente" }
          let usuario = { Usuario: response.data[0]}
          if (data == '[]') {
            res.status(200).send(error);
          } else {
            res.status(200).send(usuario);
          } 
        })
        .catch(error => {
            console.log(error);
        });  
};
controllers.usuarios.login = function (req, res) {
  axios.get(jsonserver + 'usuarios?', {
    params: {
      Usuario: req.body.Usuario,
      Password: req.body.Password
    }
  })
  .then(response => {
    data = JSON.stringify(response.data);
    let error = { Error: "Fallo autenticacion" }
    let usuario = { Usuario: response.data[0]}
    if (data == '[]') {     
      res.status(200).send(error);
    } else {
      res.status(200).send(usuario);
    }
  })
  .catch(error => {
      console.log(error);
  });  
}
controllers.juzgados.buscar = function (req,res) {
  axios.get(jsonserver + 'juzgados?', {
    params: {
      Juzgado: req.query.Cadena
    }
  })
  .then(response => {
    data = JSON.stringify(response.data);
    let error = { Error: "No se encotró juzgado" }
    let juzagados = data
    if (data == '[]') {     
      res.status(200).send(error);
    } else {
      res.status(200).send(juzagados);
    }
  })
  .catch(error => {
      console.log(error);
  });
}
