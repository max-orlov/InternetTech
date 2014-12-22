/**
 * Created by Maxim on 22/12/2014.
 */

var dev_mod = process.env.IS_DEBUG;
var msg_lvl = process.env.MSG_LVL;

exports.MESSAGE_LEVEL={
    clean: 'clean',
    dirty: 'dirty'
}

exports.devlog = function(msg,lvl){
    //console.log(env_var);
    if (dev_mod) {
        if (msg_lvl ==  exports.MESSAGE_LEVEL.dirty  && exports.MESSAGE_LEVEL.dirty == lvl) {
            //console.log("<<<<<   A LOGMSG WAS CREATED AT " + (new Date()).getHours() + ":" + (new Date()).getMinutes() + ":" + (new Date()).getSeconds() + ":" + (new Date()).getMilliseconds() + "   >>>>>")
            console.log(msg);
        }
        if (msg_lvl == exports.MESSAGE_LEVEL.clean && exports.MESSAGE_LEVEL.clean == lvl) {
            //console.log("<<<<<   A LOGMSG WAS CREATED AT " + (new Date()).getHours() + ":" + (new Date()).getMinutes() + ":" + (new Date()).getSeconds() + ":" + (new Date()).getMilliseconds() + "   >>>>>")
            console.log(msg);
        }
        if (msg_lvl == 'all')
            console.log(msg);

    }

}
