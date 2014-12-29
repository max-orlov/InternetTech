/**
 * Created by Maxim on 22/12/2014.
 */

var dev_mod = process.env.IS_DEBUG;
var msg_lvl = process.env.MSG_LVL;

exports.MESSAGE_LEVEL={
    clean: 'clean',
    dirty: 'dirty'
};

exports.devlog = function(msg){
    //console.log(env_var);
            console.log("<<<<<   A LOGMSG WAS CREATED AT " + (new Date()).getHours() + ":" + (new Date()).getMinutes() +
            ":" + (new Date()).getSeconds() + ":" + (new Date()).getMilliseconds() + "   >>>>>     " + msg)



};
