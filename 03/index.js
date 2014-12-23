var webServer = require('./hujiwebserver');

//webServer.start(8888,"C:\\Users\\Maxim\\WebstormProjects\\InternetTech\\03",function(){console.log("ERROR")});

    webServer.start(8080, "/home/maxim/WebstormProjects/InternetTech/03/tests", function (error) {
        console.log(error)
    });


    setTimeout(setupSecondServer, 5000);

function setupSecondServer() {
    webServer.start(8888, "/home/maxim/WebstormProjects/InternetTech/03/tests", function () {
        console.log("Server stopped")
    });
}