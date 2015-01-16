var uuid = require('uuid');


var Data = function () {
    this.numberOfTodos = 0;
    this.todos = {};
};


Data.prototype.list = function () {
    var list = [];
    for (var id in this.todos) {
        if (this.todos.hasOwnProperty(id)) {
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

Data.prototype.update = function (dataObj) {
    var stat = {};
    if (!(dataObj.id in this.todos)) {
        stat = {status: 1, msg: "record does not exists"};
    } else {
        stat = {status: 0};
        this.todos[dataObj.id] = dataObj;
    }
    return stat;
};

Data.prototype.delete = function (todoId) {
    if (todoId === -1) {
        this.deleteAllCompleted();
        return {status: 0};
    }
    for (var todo in this.todos) {
        if (this.todos.hasOwnProperty(todo)) {
            if (todo.id === todoId) {
                this.todos.delete(todo);
                return {status: 0};
            }
        }
    }
    return {status: 1, msg: "record does not exists"};
};

Data.prototype.deleteAllCompleted = function () {
    for (var id in this.todos) {
        if (this.todos.hasOwnProperty(id) && this.todos[id].completed) {
            delete this.todos[id];
        }
    }
};



module.exports = Data;