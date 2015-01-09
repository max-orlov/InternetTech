var webServer = require('./hujiwebserver');

webServer.start(8888, function (e, server) {
   //server.use('/:y/1/2', webServer.static('/www'));
   server.use('/root', webServer.static('/www/tom/plain/'));

});

setTimeout(function(){
   webServer.start(8888, function (e, server) {
      //server.use('/:y/1/2', webServer.static('/www'));
      server.use('/root', webServer.static('/www/tom/plain/'));

      //console.log(e);

   })}, 1000);


