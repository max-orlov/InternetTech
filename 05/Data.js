var uuid = require('uuid');


var Value = function () {
    this.tasksRemain = 0;
    this.index = 0;
    this.todos = {
        size: function(){
            var size = 0, key;
            for (key in this) {
                size++;
            }
            return size - 1;
        }
    };

};


/**
 * List all the todos of a given user id.
 * @param owner user id.
 * @returns {Array} array containing all the todos of the given user.
 */
Value.prototype.list = function (owner) {
    var todoList = [];
    for (var id in this.todos) {
        //pushes the todos of the specific owner.
        if (this.todos.hasOwnProperty(id) && this.todos[id].owner === owner) {
            todoList.push(this.todos[id]);
        }
    }
    return todoList;
};

/**
 * Creates a new todo.
 * @param dataObj object containing the todo properties.
 * @returns {{status: number}} object containing the process status (0 for success, 1 for failure).
 */
Value.prototype.create = function (dataObj) {
    var newTodo = {
        id      : this.index++,
        value   : dataObj.value,
        status  : dataObj.status,
        owner   : dataObj.owner
    };
    this.tasksRemain++;
    this.todos[newTodo.id] = newTodo;
    return {status: 0};
};

/**
 * Updates the properties of a given todo.
 * @param dataObj object containing the todo updated properties.
 * @param owner the requesting owner of the todo (used for validation).
 * @returns {{}} object containing the process status (0 for success, 1 for failure).
 */
Value.prototype.update = function (dataObj, owner) {
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
            if (dataObj.value !== undefined) {
                this.todos[dataObj.id].value = dataObj.value;
            }
            if (dataObj.status !== undefined) {
                this.tasksRemain += dataObj.status == "1" ? -1 : 1;
                this.todos[dataObj.id].status = dataObj.status;
            }
            stat = {status: 0};

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
Value.prototype.delete = function (todoId, owner) {
    //in case todoId === -1 deletes all the todos of thisUser
    if (todoId == -1) {
        this.deleteAllCompleted(owner);
        return {status: 0, isAnyNonActive: false};
    }
    //looks for the wanted todoId.
    if (todoId in this.todos) {
        //verifies that the requested owner is the real owner.
        if (this.todos[todoId].owner === owner) {
            this.tasksRemain += this.todos[todoId].status != 1 ? -1 : 0;
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
Value.prototype.deleteAllCompleted = function (owner) {
    for (var id in this.todos) {
        if (this.todos.hasOwnProperty(id) && this.todos[id].status == 1 && this.todos[id].owner === owner) {
            delete this.todos[id];
        }
    }
};



module.exports = Value;