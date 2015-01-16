var loginScreen = document.getElementById('login'),
    registerScreen = document.getElementById('register'),
    todoScreen = document.getElementById('todoapp'),
    todoList = document.getElementById('todo-list'),
    active = 1,
    completed = 0;


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
            alert(xhr);
        }
    });
}

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

function addTodo() {
    var todo = document.getElementById('new-todo');
    if (todo.value !== '') {
        var newTodo = {
            title: todo,
            status: active
        };
        $.ajax({
            url: '/item',
            type: 'POST',
            data: newTodo,
            success: function (result, status, xhr) {
                populateList();
            },
            error: function (xhr, status, error) {
                if (error=='please login first'){
                    logout();
                }
                alert(error);
            }
        });
    }
}

function editTodo() {
}

function deleteTodo() {

}



function injectTodo(todo) {
    var newTodo
        =	'<li data-id="{{id}}" class="{{completed}}">'
    +		'<div class="view">'
    +			'<input class="toggle" type="checkbox" {{checked}}>'
    +			'<label>{{title}}</label>'
    +			'<button class="destroy"></button>'
    +		'</div>'
    +	'</li>';

    newTodo = newTodo.replace('{{id}}', todo.id);
    newTodo = newTodo.replace('{{title}}', todo.title);
    newTodo = newTodo.replace('{{completed}}', '');
    newTodo = newTodo.replace('{{checked}}', '');

    todoList.innerHTML += newTodo;
}

function displayLoginScreen() {
    loginScreen.style.display = 'block';
    registerScreen.style.display = 'none';
    todoScreen.style.display = 'none';
}

function displayRegisterScreen() {
    loginScreen.style.display = 'none';
    registerScreen.style.display = 'block';
    todoScreen.style.display = 'none';
}

function displayTodoScreen() {
    loginScreen.style.display = 'none';
    registerScreen.style.display = 'none';
    todoScreen.style.display = 'block';
}