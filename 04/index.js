var webServer = require('./hujiwebserver');


webServer.start(8888, function (e, server) {

   server.use('/root', webServer.static('/tests'));

   server.use('/hello/hacker/', function(request, response){

      response.status(200).send('HackInProgress');
      var load = request.query['load'];
      var att = request.host.split(':');
      var op = {
            host: att[0],
            port: parseInt(att[1]),
            path: request.path,
            method: request.method,
            headers : {Connection: 'close'}
         };

      for (var i = 0 ; i < load ; i++) {
         require('http').get(op,function(){});
      }

   })
});

