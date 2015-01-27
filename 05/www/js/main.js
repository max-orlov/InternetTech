var loginScreen             = document.getElementById('login'),
    registerScreen          = document.getElementById('register'),
    todoScreen              = document.getElementById('todoapp'),
    todoList                = document.getElementById('todo-list'),
    registerErrorMessage    = document.getElementById('register_error_message'),
    loginErrorMessage       = document.getElementById('login_error_message'),
    active                  = 0,
    completed               = 1;


function aloha(){
    $.ajax( {
        url: '/aloha',
        type: 'GET',
        success: function (result, status, xhr) {
            if (result !== ''){
                displayTodoScreen();
                populateList(result.list);
                updateEnvironment(result.listSize);
            }
            else{
                clearLoginInfo();
                displayLoginScreen();
            }
        },
        error: function (xhr, status, error) {
            alert(error);
        }
    });
}


/**
 * Performs user login.
 */
function login() {
    var username = document.getElementById('login_username');
    var password = document.getElementById('login_password');
    var user = {
        username: username.value,
        password: password.value
    };
    $.ajax( {
        url: '/login',
        type: 'GET',
        data: user,
        success: function (result, status, xhr) {
            getList();
            clearLoginInfo();
            displayTodoScreen();
        },
        error: function (xhr, status, error) {
            loginErrorMessage.innerHTML = error;
        }
    });
}

/**
 * Performs user registration.
 */
function register() {
    var fullname = document.getElementById('register_fullname');
    var username = document.getElementById('register_username');
    var password = document.getElementById('register_password');
    var passwordValidation = document.getElementById('register_password_validation');
    var user = {
        fullname: fullname.value,
        username: username.value,
        password: password.value,
        passwordValidation: passwordValidation.value
    };
    $.ajax( {
        url: '/register',
        type: 'POST',
        data: user,
        success: function (result, status, xhr) {
            getList();
            clearRegistrationInfo();
            displayTodoScreen();
        },
        error: function (xhr, status, error) {
            registerErrorMessage.innerHTML = error;
        }
    });
}

/**
 * Adds a new todo.
 */
function addTodo() {
    var todo = document.getElementById('new-todo');
    //add the new todo only if it's not empty
    if (todo.value.trim() !== '') {
        var newTodo = {
            value: todo.value.trim(),
            status: active
        };
        todo.value = '';
        $.ajax( {
            url: '/item',
            type: 'POST',
            data: newTodo,
            success: function (result, status, xhr) {
                getList();

            },
            error: function (xhr, status, error) {
                if (xhr.status == 400) {
                    loginErrorMessage.innerHTML = error;
                    displayLoginScreen();
                } else {
                    alert(error);
                }
            }
        });
    }
}


function updateEnvironment(tasksRemain, totalListSize){
    $.ajax({
        url: '/env',
        type: 'GET',
        success: function (result, status, xhr) {
            var tasksDone = result.totalListSize - result.tasksRemain;
            document.getElementById('clear-completed').style.display = tasksDone > 0 ? 'block' : 'none';
            document.getElementById('todo-count').innerHTML = result.totalListSize > 0 ? result.totalListSize : '';
            document.getElementById('toggle-all').checked = (result.tasksRemain === 0 && result.totalListSize > 0);
        },
        error: function (xhr, status, error) {
            alert(error);
        }
    });

}

/**
 * Populates the todos in the todos-list.
 * @param todos todos to populate.
 */
function populateList(todos){
    todoList.innerHTML = "";
    for (var i = 0; i <= todos.length - 1; i++) {
        injectTodo(todos[i])
    }
}


/**
 * Get all the items of the current user.
 */
function getList() {
    $.ajax({
        url: '/item',
        type: 'GET',
        success: function (result, status, xhr) {
            populateList(result);
            updateEnvironment();
        },
        error: function (xhr, status, error) {
            if (xhr.status == 400) {
                loginErrorMessage.innerHTML = error;
                displayLoginScreen();
            } else {
                alert(error);
            }
        }
    });
}

/**
 * Updates the todo body inside the database.
 * @param todoId the id of the todo to update.
 */
function updateTodo(todoId) {
    var listTodo = document.querySelector('[data-id="' + todoId + '"]');

    if (!listTodo) {
        return;
    }

    var input = listTodo.querySelector('input.edit');
    var inputValue = input.value;

    var todo = {id: todoId, value: inputValue};

    $.ajax( {
        url: '/item',
        type: 'PUT',
        data: todo,
        success: function (result, status, xhr) {
            listTodo.removeChild(input);
            listTodo.className = listTodo.className.replace('editing', '');
            listTodo.getElementsByTagName('label')[0].firstChild.data = inputValue;
            updateEnvironment();
        },
        error: function (xhr, status, error) {
            if (xhr.status == 400) {
                loginErrorMessage.innerHTML = error;
                displayLoginScreen();
            } else {
                alert(error);
            }
        }
    });

}

/**
 * Edit the body of a given todo.
 * @param todoId the id of the todo to edit.
 */
function editTodo(todoId) {
    var listTodo = document.querySelector('[data-id="' + todoId + '"]');

    if (!listTodo) {
        return;
    }
    var labelValue = listTodo.getElementsByTagName('label')[0].firstChild.data;

    listTodo.className = listTodo.className + ' editing';

    var input = document.createElement('input');
    input.className = 'edit';
    input.setAttribute('onkeydown', 'if (event.keyCode == 13) updateTodo(' + todoId + ')');
    input.setAttribute('onblur', 'updateTodo(' + todoId + ')');

    listTodo.appendChild(input);
    input.focus();
    input.value = labelValue;

}

/**
 * Delete a given todo from the database.
 * @param todoId the id of the todo to delete.
 */
function deleteTodo(todoId) {
    $.ajax({
        url: '/item',
        type: 'DELETE',
        data: {id: todoId},
        success: function (result, status, xhr) {
            getList();
        },
        error: function (xhr, status, error) {
            if (xhr.status == 400) {
                loginErrorMessage.innerHTML = error;
                displayLoginScreen();
            } else {
                alert(error);
            }
        }
    });
}

/**
 * Updates the status of a given todo to completed.
 * @param todoId the id of the todo to update.
 */
function completeTodo(todoId) {
    var listTodo = document.querySelector('[data-id="' + todoId + '"]');
    if (!listTodo) {
        return;
    }

    var value = listTodo.getElementsByTagName('label')[0].firstChild.data;
    var oldStatus = listTodo.className;
    var newStatus = oldStatus === '' ? 'completed' : '';

    var todoStatus = newStatus === '' ? active : completed;


    $.ajax({
        url: '/item',
        type: 'PUT',
        data: {id: todoId, value: value, status: todoStatus},
        success: function (result, status, xhr) {
            listTodo.className = newStatus;
            listTodo.querySelector('input').checked = todoStatus;
            updateEnvironment(result.tasksRemain, result.totalListSize);
        },
        error: function (xhr, status, error) {
            if (xhr.status == 400) {
                loginErrorMessage.innerHTML = error;
                displayLoginScreen();
            } else {
                alert(error);
            }
        }
    });
}

function completeAll() {
    $.ajax({
        url: '/item',
        type: 'GET',
        success: function (result, status, xhr) {
            var todos = result;
            var isAllCompleted = true;
            for (var i = 0; i <= todos.length - 1; i++) {
                if (todos[i].status != 1) {
                    isAllCompleted = false;
                }
            }

            for (i = 0; i <= todos.length - 1; i++) {
                if (isAllCompleted) {
                    completeTodo(todos[i].id);
                } else {
                    if (todos[i].status !== '1') {
                        completeTodo(todos[i].id);
                    }
                }
            }
            updateEnvironment();
        },
        error: function (xhr, status, error) {
            if (xhr.status == 400) {
                loginErrorMessage.innerHTML = error;
                displayLoginScreen();
            } else {
                alert(error);
            }
        }
    });
}

/**
 * Deleted all the completed todos from the db.
 */
function clearCompleted() {
    $.ajax({
        url: '/item',
        type: 'DELETE',
        data: {id : -1},
        success: function (result, status, xhr) {
            getList()
        },
        error: function (xhr, status, error) {
            if (xhr.status == 400) {
                loginErrorMessage.innerHTML = error;
                displayLoginScreen();
            } else {
                alert(error);
            }
        }
    });
}


/**
 * Insert a new todo into the todo list.
 * @param todo the new todo to insert.
 */
function injectTodo(todo) {
    var completedStatus = '';
    var checkedStatus = '';
    var newTodo
        =	'<li data-id="{{id}}" class="{{completed}}">'
        +		'<div class="view">'
        +			'<input class="toggle" onclick="completeTodo(' + "{{id}}" + ')" type="checkbox" {{checked}}>'
        +			'<label ondblclick="editTodo(' + "{{id}}" + ')">{{value}}</label>'
        +			'<button class="destroy" onclick="deleteTodo(' + "{{id}}" + ')"></button>'
        +		'</div>'
        +	'</li>';

    if (todo.status === completed.toString()) {
        completedStatus = 'completed';
        checkedStatus = 'checked';
    }

    newTodo = newTodo.replace(/\{\{id}}/g, todo.id);
    newTodo = newTodo.replace('{{value}}', todo.value);
    newTodo = newTodo.replace('{{completed}}', completedStatus);
    newTodo = newTodo.replace('{{checked}}', checkedStatus);

    todoList.innerHTML += newTodo;
}

/**
 * Performs logout.
 */
function logout() {
    $.ajax( {
        url: '/mahalo',
        type: 'GET',
        success: function (result, status, xhr) {
            clearLoginInfo();
            displayLoginScreen();
        },
        error: function (xhr, status, error) {
            alert(error);
        }
    });

}

/**
 * Displays the login screen.
 */
function displayLoginScreen() {
    loginScreen.style.display = 'block';
    registerScreen.style.display = 'none';
    todoScreen.style.display = 'none';
    document.getElementById("login_username").focus();
}

/**
 * Display the registration screen.
 */
function displayRegisterScreen() {
    loginScreen.style.display = 'none';
    registerScreen.style.display = 'block';
    todoScreen.style.display = 'none';
    document.getElementById("register_fullname").focus();
}

/**
 * Display the todo screen.
 */
function displayTodoScreen() {
    loginScreen.style.display = 'none';
    registerScreen.style.display = 'none';
    todoScreen.style.display = 'block';
    document.getElementById("new-todo").focus();
}

/**
 * Clears the registration information.
 */
function clearRegistrationInfo() {
    registerErrorMessage.innerHTML = '';
    document.getElementById("register_fullname").value = "";
    document.getElementById("register_username").value = "";
    document.getElementById("register_password").value = "";
    document.getElementById("register_password_validation").value = "";
}

/**
 * Clears the login information.
 */
function clearLoginInfo() {
    loginErrorMessage.innerHTML = '';
    document.getElementById("login_username").value = "";
    document.getElementById("login_password").value = "";
}

aloha();