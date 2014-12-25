var HTTP = require('http');
var NET = require('net');
var HUJI = require('../hujiwebserver');


var PORT = 8124;
var LOAD_SIZE = 400; //LOAD_SIZE*2 in total-> its LOAD_SIZE requests with keep alive and LOAD_SIZE requests with close connection


function test(i, connection){
    var request;
    var connection;

    connection = NET.createConnection(PORT);
    connection.setNoDelay();

    connection.write('GET /black.jpg HTTP/1.1\r\nHost:localhost\r\n' +
    'Connection: '+ connection);
    connection.on('data',function(data){
        console.log(' got response for request: '+ i);
    });

    connection.on('error',function(error){
        console.log(' error for request: '+i);
    });

}

function loadTest(){
    var id = HUJI.start(PORT,"C:\\Users\\Tom\\Copy\\University\\Computer Science\\Third Year (2014-2015)\\Semester A\\Internet Technologies\\Projects\\InternetTech\\03",function(){console.log("ERROR")});

    for (var i=0; i<LOAD_SIZE; i++){
        test(i,'keep-alive');
    }

    for (i=0; i<LOAD_SIZE; i++){
        test(i,'close');
    }

    //close the server after 10 seconds, no need to run forever
    setTimeout(function(){
        HUJI.stop(id, function(){console.log("ERROR")});
    }, 4000)
}

loadTest();