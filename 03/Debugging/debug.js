/**
 * Created by Maxim on 22/12/2014.
 */


exports.devlog = function(msg){
    var env_var = process.env.IS_DEBUG;
    //console.log(env_var);
    if (env_var == 'true'){
        console.log("<<<<<   A LOGMSG WAS CREATED AT " + (new Date()).getHours() + ":" + (new Date()).getMinutes() + ":" + (new Date()).getSeconds() + ":" + (new Date()).getMilliseconds()+"   >>>>>")
        console.log(msg);
    }
}