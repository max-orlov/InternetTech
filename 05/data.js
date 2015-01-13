var uuid = require('uuid');


var Data = function () {
    this.todos = {};
};


Data.list = function () {
    var list = [];
    for (var id in this.todos) {
        if (this.todos.hasOwnProperty(id)) {
            list.push(this.todos[id]);
        }
    }
    return list;
};

Data.create = function (dataObj) {
    var stat = {};
    if (dataObj.id in this.todos) {
        stat = {status: 1, msg: "record already exists"};
    } else {
        stat = {status: 0};
        this.todos[dataObj.id] = dataObj;
    }
    return stat;
};

Data.update = function (dataObj) {
    var stat = {};
    if (!(dataObj.id in this.todos)) {
        stat = {status: 1, msg: "record does not exists"};
    } else {
        stat = {status: 0};
        this.todos[dataObj.id] = dataObj;
    }
    return stat;
};

Data.delete = function (dataObj) {
    var stat = {};
    if (!(dataObj.id in this.todos)) {
        stat = {status: 1, msg: "record does not exists"};
    } else {
        stat = {status: 0};
        delete this.todos[dataObj.id];
    }
    return stat;
};

Data.deleteAllCompleted = function () {
    for (var id in this.todos) {
        if (this.todos.hasOwnProperty(id) && this.todos[id].completed) {
            delete this.todos[id];
        }
    }
};



module.exports = Data;