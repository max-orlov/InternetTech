var loginScreen = document.getElementById('login'),
    registerScreen = document.getElementById('register'),
    todoScreen = document.getElementById('todoapp'),
    todoList = document.getElementById('todo-list'),
    active = 0,
    completed = 1;


/**
 * Performs user login.
 */
function login() {
    var username = document.getElementById('loginUsername');
    var password = document.getElementById('loginPassword');
    var user = {
        username: username.value,
        password: password.value
    };
    $.ajax( {
        url: '/login',
        type: 'POST',
        data: user,
        success: function (result, status, xhr) {
            displayTodoScreen();
        },
        error: function (xhr, status, error) {
            alert(error);
        }
    });
}

/**
 * Performs user registration.
 */
function register() {
    var fullname = document.getElementById('registerFullname');
    var username = document.getElementById('registerUsername');
    var password = document.getElementById('registerPassword');
    var passwordValidation = document.getElementById('registerPasswordValidation');
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
            displayTodoScreen();
        },
        error: function (xhr, status, error) {
            alert(error);
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
            title: todo.value.trim(),
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
                alert(error);
            }
        });
    }
}

function getList() {
    $.ajax({
        url: '/item',
        type: 'GET',
        success: function (result, status, xhr) {
            var todos = result;
            todoList.innerHTML = "";
            for (var i = 0; i <= todos.length - 1; i++) {
                injectTodo(todos[i])
            }
        },
        error: function (xhr, status, error) {
            alert(error);
        }
    });
}

function updateTodo(todoId) {
    var listTodo = document.querySelector('[data-id="' + todoId + '"]');

    if (!listTodo) {
        return;
    }

    var input = listTodo.querySelector('input.edit');
    var inputValue = input.value;

    var todo = {id: todoId, title: inputValue};

    $.ajax( {
        url: '/item',
        type: 'PUT',
        data: todo,
        success: function (result, status, xhr) {

            listTodo.removeChild(input);
            listTodo.className = listTodo.className.replace('editing', '');
            listTodo.getElementsByTagName('label')[0].firstChild.data = inputValue;
        },
        error: function (xhr, status, error) {
            alert(error);
        }
    });

}

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

function deleteTodo(todoId) {
    $.ajax({
        url: '/item',
        type: 'DELETE',
        data: {id: todoId},
        success: function (result, status, xhr) {
            getList();
        },
        error: function (xhr, status, error) {
            alert(error);
        }
    });
}

function completeTodo(todoId) {
    var listTodo = document.querySelector('[data-id="' + todoId + '"]');
    if (!listTodo) {
        return;
    }

    var title = listTodo.getElementsByTagName('label')[0].firstChild.data;
    var oldStatus = listTodo.className;
    var newStatus = oldStatus === '' ? 'completed' : '';

    var todoStatus = newStatus === '' ? active : completed;

    $.ajax({
        url: '/item',
        type: 'PUT',
        data: {id: todoId, title: title, status: todoStatus},
        success: function (result, status, xhr) {
            listTodo.className = newStatus;
            listTodo.querySelector('input').checked = todoStatus;
        },
        error: function (xhr, status, error) {
            alert(error);
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
        },
        error: function (xhr, status, error) {
            alert(error);
        }
    });
}

function clearCompleted() {
    $.ajax({
        url: '/item',
        type: 'DELETE',
        data: {id : -1},
        success: function (result, status, xhr) {
            getList()
        },
        error: function (xhr, status, error) {
            alert(error);
        }
    });
}



function injectTodo(todo) {
    var completedStatus = '';
    var checkedStatus = '';
    var newTodo
        =	'<li data-id="{{id}}" class="{{completed}}">'
        +		'<div class="view">'
        +			'<input class="toggle" onclick="completeTodo(' + "{{id}}" + ')" type="checkbox" {{checked}}>'
        +			'<label ondblclick="editTodo(' + "{{id}}" + ')">{{title}}</label>'
        +			'<button class="destroy" onclick="deleteTodo(' + "{{id}}" + ')"></button>'
        +		'</div>'
        +	'</li>';

    if (todo.status === completed) {
        completedStatus = 'completed';
        checkedStatus = 'checked';
    }

    newTodo = newTodo.replace(/\{\{id}}/g, todo.id);
    newTodo = newTodo.replace('{{title}}', todo.title);
    newTodo = newTodo.replace('{{completed}}', completedStatus);
    newTodo = newTodo.replace('{{checked}}', checkedStatus);

    todoList.innerHTML += newTodo;
}

function displayLoginScreen() {
    loginScreen.style.display = 'block';
    registerScreen.style.display = 'none';
    todoScreen.style.display = 'none';
    document.getElementById("loginUsername").focus();
}

function displayRegisterScreen() {
    loginScreen.style.display = 'none';
    registerScreen.style.display = 'block';
    todoScreen.style.display = 'none';
    document.getElementById("registerFullname").focus();
}

function displayTodoScreen() {
    loginScreen.style.display = 'none';
    registerScreen.style.display = 'none';
    todoScreen.style.display = 'block';
    document.getElementById("new-todo").focus();
}