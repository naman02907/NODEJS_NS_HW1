var http = require("http");
var https = require("https");
var url = require("url");
var stringDecoder = require("string_decoder").StringDecoder;
var config = require('./config');
var fs = require('fs');

var httpServer = http.createServer(function(req,res){
    unifiedServer(req,res);
}); 

httpServer.listen(config.httpPort,function(){
    console.log("The server is listening on port "+config.httpPort);
});

httpsServerOptions = {
    'key' : fs.readFileSync('./https/key.pem'),
    'cert' : fs.readFileSync('./https/cert.pem')
 };

var httpsServer = https.createServer(httpsServerOptions,function(req,res){
    unifiedServer(req,res);
}) ;



httpsServer.listen(config.httpsPort,function(){
    console.log("The server is listening on port "+config.httpsPort);
});



var unifiedServer = function(req,res){
    var parsedUrl = url.parse(req.url,true);
    
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g,'');
    
    var queryStringObject = parsedUrl.query;
    
    var method = req.method.toLowerCase();

    var headers = req.headers;

    var decoder = new stringDecoder('utf-8');
    var buffer = '';
    req.on('data',function(data){
        buffer += decoder.write(data);
    });
    req.on('end',function(){
        buffer += decoder.end();

        var choosenHandler = typeof(router[trimmedPath]) !== 'undefined'? router[trimmedPath] : handler.notfound;
        
        var data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers' : headers,
            'payload' : buffer
        };

        choosenHandler(data,function(statusCode,payload){
            statusCode = typeof(statusCode) == 'number'? statusCode : 200;
            payload = typeof(payload) == 'object'? payload : {};
            var payloadString = JSON.stringify(payload);

            res.setHeader('Content-Type','application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
            console.log('returning the response: ',statusCode,payloadString);
        });
    })
};

var handler = {};

handler.hello = function(data,callback){
    callback(406, {'message' : 'welcome to NODEJS'});
}

handler.notfound = function(data,callback){
    callback(404);
}

var router = {
    'hello' : handler.hello
};


