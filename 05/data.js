var uuid = require('uuid');


var Data = function () {
    this.todoCounter = 0;
    this.todos = {};
};


/**
 * List all the todos of a given user id.
 * @param owner user id.
 * @returns {Array} array containing all the todos of the given user.
 */
Data.prototype.list = function (owner) {
    var list = [];
    for (var id in this.todos) {
        //pushes the todos of the specific owner.
        if (this.todos.hasOwnProperty(id) && this.todos[id].owner === owner) {
            list.push(this.todos[id]);
        }
    }
    return list;
};

/**
 * Creates a new todo.
 * @param dataObj object containing the todo properties.
 * @returns {{status: number}} object containing the process status (0 for success, 1 for failure).
 */
Data.prototype.create = function (dataObj) {
    var newTodo = {
        id      : this.todoCounter++,
        title   : dataObj.title,
        status  : dataObj.status,
        owner   : dataObj.owner
    };
    this.todos[newTodo.id] = newTodo;
    return {status: 0};
};

/**
 * Updates the properties of a given todo.
 * @param dataObj object containing the todo updated properties.
 * @param owner the requesting owner of the todo (used for validation).
 * @returns {{}} object containing the process status (0 for success, 1 for failure).
 */
Data.prototype.update = function (dataObj, owner) {
    var stat = {};
    //the given todo doesn't exists.
    if (!(dataObj.id in this.todos)) {
        stat = {status: 1, msg: "Record does not exists"};

    } else {
        //the owner of the given todo doesn't matches the real owner.
        if (this.todos[dataObj.id].owner !== owner) {
            stat =  {status: 1, msg: "User cannot update other user's todo"};
            //everything is fine.
        } else {
            stat = {status: 0};
            this.todos[dataObj.id].title = dataObj.title;
            this.todos[dataObj.id].status = dataObj.status;
        }
    }
    return stat;
};

/**
 * Deletes a todo from the database.
 * @param todoId the todo to delete.
 * @param owner the requesting owner of the todo
 * @returns {*} object containing the process status (0 for success, 1 for failure).
 */
Data.prototype.delete = function (todoId, owner) {
    //in case todoId === -1 deletes all the todos of thisUser
    if (todoId === -1) {
        this.deleteAllCompleted(owner);
        return {status: 0};
    }
    //looks for the wanted todoId.
    if (todoId in this.todos) {
        //verifies that the requested owner is the real owner.
        if (this.todos[todoId].owner === owner) {
            delete this.todos[todoId];
            return {status: 0};
        } else {
            return {status: 1, msg: "User cannot delete other user's todo"};
        }
    } else {
        return {status: 1, msg: "Record does not exists"};
    }
};

/**
 * Deletes all the completed todos of a given user
 * @param owner the user id.
 */
Data.prototype.deleteAllCompleted = function (owner) {
    for (var id in this.todos) {
        if (this.todos.hasOwnProperty(id) && this.todos[id].status == 1 && this.todos[id].owner === owner) {
            delete this.todos[id];
        }
    }
};



module.exports = Data;