var uuid = require('uuid');


var Data = function () {
    this.numberOfTodos = 0;
    this.todos = {};
};


Data.prototype.list = function (owner) {
    var list = [];
    for (var id in this.todos) {
        if (this.todos.hasOwnProperty(id) && this.todos[id].owner === owner) {
            list.push(this.todos[id]);
        }
    }
    return list;
};

Data.prototype.create = function (dataObj) {
    var newTodo = {
        id: this.numberOfTodos++,
        title: dataObj.title,
        status: dataObj.status,
        owner: dataObj.owner
    };
    this.todos[newTodo.id] = newTodo;
    return {status: 0};
};

Data.prototype.update = function (dataObj, owner) {
    var stat = {};
    if (!(dataObj.id in this.todos)) {
        stat = {status: 1, msg: "Record does not exists"};
    } else {
        if (this.todos[dataObj.id].owner !== owner) {
            stat =  {status: 1, msg: "User cannot update other user's todo"};
        } else {
        stat = {status: 0};
        this.todos[dataObj.id].title = dataObj.title;
        }
    }
    return stat;
};

Data.prototype.delete = function (todoId, owner) {
    if (todoId === -1) {
        this.deleteAllCompleted();
        return {status: 0};
    }
    if (todoId in this.todos && this.todos[todoId].owner === owner) {
        delete this.todos[todoId];
        return {status: 0};
    } else if (!(todoId in this.todos)){
        return {status: 1, msg: "Record does not exists"};
    } else {
        return {status: 1, msg: "User cannot delete other user's todo"};
    }
};

Data.prototype.deleteAllCompleted = function () {
    for (var id in this.todos) {
        if (this.todos.hasOwnProperty(id) && this.todos[id].completed) {
            delete this.todos[id];
        }
    }
};



module.exports = Data;