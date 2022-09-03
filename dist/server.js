var https = require("https");
const express = require("express");
var pem = require("https-pem");

var server = https.createServer(express);

server.listen(3000, function () {
  console.log("The server is running on https://localhost");
});
