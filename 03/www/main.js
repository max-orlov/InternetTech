//Adds the specified attributes to an element, and gives them the specified values.
Element.prototype.setAttributes = function (attributes) {
    for (var key in attributes) {
        this.setAttribute(key, attributes[key]);
    }
};


//creates a new calculator object.
var Calculator = function() {
    this.output = 0;
};

//add the given input to the output, and returns the output.
Calculator.prototype.add = function (a) {
    this.output += a;
    return this.output;
};
//multiply the given input with the output, and returns the output.
Calculator.prototype.multiply = function (a) {
    this.output *= a;
    return this.output;
};
//clear the output and returns it.
Calculator.prototype.clear = function () {
    this.output = 0;
    return this.output;
};

//creates an instance of calculator.
var basic_calc = new Calculator();



/////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////HTML GENERATION///////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////LOGIN SCREEN//////////////////////////////////////////

//login div.
var login_screen_div = document.createElement("div");
login_screen_div.setAttribute("id", "login_screen");
document.body.appendChild(login_screen_div);

//login heading.
var login_h2 = document.createElement("h2");
login_h2.appendChild(document.createTextNode("Internet Course Login"));
login_screen_div.appendChild(login_h2);

//username label.
var username_label = document.createElement("label");
username_label.setAttribute("for", "username");
username_label.appendChild(document.createTextNode("Username:"));
login_screen_div.appendChild(username_label);

//username input.
var username = document.createElement("input");
username.setAttributes({type: "text", id: "username"});
login_screen_div.appendChild(username);

//password label.
var password_label = document.createElement("label");
password_label.setAttribute("for", "password");
password_label.appendChild(document.createTextNode("Password:"));
login_screen_div.appendChild(password_label);

//password input.
var password = document.createElement("input");
password.setAttributes({type: "password", id: "password"});
login_screen_div.appendChild(password);

//login button.
var login_button = document.createElement("input");
login_button.setAttributes({type: "button", id: "login_button", value: "Login"});
login_screen_div.appendChild(login_button);

//login message.
var login_message = document.createElement("div");
login_message.setAttribute("id", "login_message");
login_screen_div.appendChild(login_message);


//////////////////////////////////PROFILE SCREEN/////////////////////////////////////////

//profile div.
var profile_screen_div = document.createElement("div");
profile_screen_div.setAttribute("id", "profile_screen");
document.body.appendChild(profile_screen_div);

//profile heading.
var profile_h2 = document.createElement("h2");
profile_h2.appendChild(document.createTextNode("Profile Information"));
profile_screen_div.appendChild(profile_h2);

//profile content table.
var profile_content = document.createElement("table");
profile_content.setAttribute("id", "profile_content");
profile_screen_div.appendChild(profile_content);

//name row
var name_tr = document.createElement("tr");
profile_content.appendChild(name_tr);

var name_title_td = document.createElement("td");
name_title_td.setAttribute("class", "profile_titles");
name_title_td.appendChild(document.createTextNode("Name:"));
name_tr.appendChild(name_title_td);

var name_content_td = document.createElement("td");
name_content_td.appendChild(document.createTextNode("Tom Hoffen"));
name_tr.appendChild(name_content_td);

//hobbies row
var hobbies_tr = document.createElement("tr");
profile_content.appendChild(hobbies_tr);

var hobbies_title_td = document.createElement("td");
hobbies_title_td.setAttribute("class", "profile_titles");
hobbies_title_td.appendChild(document.createTextNode("Hobbies:"));
hobbies_tr.appendChild(hobbies_title_td);

var hobbies_content_td = document.createElement("td");
hobbies_content_td.appendChild(document.createTextNode("Basketball and Tennis."));
hobbies_tr.appendChild(hobbies_content_td);

//funny quote row.
var quote_tr = document.createElement("tr");
profile_content.appendChild(quote_tr);

var quote_title_td = document.createElement("td");
quote_title_td.setAttribute("class", "profile_titles");
quote_title_td.appendChild(document.createTextNode("Funny Quote:"));
quote_tr.appendChild(quote_title_td);

var quote_content_td = document.createElement("td");
quote_content_td.appendChild(document.createTextNode("Always remember that you are absolutely unique. Just like everyone else."));
quote_tr.appendChild(quote_content_td);

//images div
var images_div = document.createElement("div");
images_div.setAttribute("id", "images");
profile_screen_div.appendChild(images_div);

//image 1
var profile_image = document.createElement("img");
profile_image.setAttributes({id: "profile_image", src: "http://thumbs.dreamstime.com/x/logo-internet-4720961.jpg", alt: "Internet"});
images_div.appendChild(profile_image);


//calculator button.
var calculator_button = document.createElement("input");
calculator_button.setAttributes({type: "button", id: "calculator_button", value: "Calculator"});
profile_screen_div.appendChild(calculator_button);

//logout button.
var logout = document.createElement("input");
logout.setAttributes({type: "button", id: "logout_button", value: "Logout"});
profile_screen_div.appendChild(logout);



////////////////////////////////CALCULATOR SCREEN////////////////////////////////////////

//calculator div.
var calculator_screen_div = document.createElement("div");
calculator_screen_div.setAttribute("id", "calculator_screen");
document.body.appendChild(calculator_screen_div);

//calculator heading
var h2 = document.createElement("h2");
h2.appendChild(document.createTextNode("Calculator"));
calculator_screen_div.appendChild(h2);

//calculator content.
var calculator = document.createElement("div");
calculator.setAttribute("id", "calculator_content");
calculator_screen_div.appendChild(calculator);

//output screen label.
var output_screen_label = document.createElement("label");
output_screen_label.setAttribute("for", "output_screen");
output_screen_label.appendChild(document.createTextNode("Output:"));
calculator.appendChild(output_screen_label);

//output screen.
var output_screen = document.createElement("input");
output_screen.setAttributes({type: "text", readOnly: true, id: "output_screen", value: 0});
calculator.appendChild(output_screen);

//input box label.
var input_box_label = document.createElement("label");
input_box_label.setAttribute("for", "input_box");
input_box_label.appendChild(document.createTextNode("Input:"));
calculator.appendChild(input_box_label);

//input box.
var input_box = document.createElement("input");
input_box.setAttributes({type: "text", id: "input_box"});
calculator.appendChild(input_box);

//add button.
var add = document.createElement("input");
add.setAttributes({type: "button", id: "add_button", value: "+"});
calculator.appendChild(add);

//multiply button
var mult = document.createElement("input");
mult.setAttributes({type: "button", id: "multiply_button", value: "*"});
calculator.appendChild(mult);

//clear button.
var clear = document.createElement("input");
clear.setAttributes({type: "button", id: "clear_button", value: "C"});
calculator.appendChild(clear);

//profile button.
var profile_info_button = document.createElement("input");
profile_info_button.setAttributes({type: "button", id: "profile_info_button", value: "Profile"});
calculator_screen_div.appendChild(profile_info_button);

//login button.
var c_login_button = document.createElement("input");
c_login_button.setAttributes({type: "button", id: "c_login_button", value: "Login"});
calculator_screen_div.appendChild(c_login_button);




/////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////EVENT LISTENERS///////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

var login_screen = document.getElementById("login_screen");
var profile_screen = document.getElementById("profile_screen");
var calculator_screen = document.getElementById("calculator_screen");

document.getElementById("username").focus();

//displays only the login screen.
profile_screen.style.display = "none";
calculator_screen.style.display = "none";


//serverError listener for the login button.
//validate username and password. if valid it transfer the user to the profile screen.
// otherwise it prints an error message.
document.getElementById("login_button").addEventListener("click", function () {
    var username = document.getElementById("username");
    var password = document.getElementById("password");
    var msg = document.getElementById("login_message");
    if ((username.value === password.value) && (username.value === 'admin')) {
        username.value = "";
        password.value = "";
        msg.innerHTML = "";
        login_screen.style.display = "none";
        profile_screen.style.display = "block";
    } else {
        msg.innerHTML = "Login failed, invalid username or password.";
        msg.style.color = "red";
    }
});


//serverError listener for the calculator button.
//transfer the user to the calculator screen.
document.getElementById("calculator_button").addEventListener("click", function () {
    profile_screen.style.display = "none";
    calculator_screen.style.display = "block";
    document.getElementById("input_box").focus();
});


//serverError listener for the logout button.
//transfer the user to the login screen and prints an appropriate message.
document.getElementById("logout_button").addEventListener("click", function () {
    var msg = document.getElementById("login_message");
    profile_screen.style.display = "none";
    login_screen.style.display = "block";
    msg.innerHTML = "You have successfully logged out.";
    msg.style.color = "blue";
    document.getElementById("username").focus();
});


//serverError listener for the login button (the one in calculator screen).
//transfer the user to the login screen.
document.getElementById("c_login_button").addEventListener("click", function () {
    var msg = document.getElementById("login_message");
    document.getElementById("output_screen").value = basic_calc.clear();
    msg.innerHTML = "You have successfully logged out.";
    msg.style.color = "blue";
    calculator_screen.style.display = "none";
    login_screen.style.display = "block";
    document.getElementById("username").focus();
});


//serverError listener for the profile information button.
//transfer the user to the profile screen.
document.getElementById("profile_info_button").addEventListener("click", function () {
    calculator_screen.style.display = "none";
    profile_screen.style.display = "block";
});


//serverError listeners for the profile images.
//switches between images upon mouse over.
var image = document.getElementById("profile_image");
image.addEventListener("mouseover", function () {
    if (image.src === "http://thumbs.dreamstime.com/x/logo-internet-4720961.jpg") {
        image.src = "http://in-the-flow.com/wp-content/uploads/2010/07/Internet4.jpg";
    } else {
        image.src = "http://thumbs.dreamstime.com/x/logo-internet-4720961.jpg";
    }
});


//serverError listener for the clear button.
//changes the value of the output screen to 0.
document.getElementById("clear_button").addEventListener("click", function () {
    document.getElementById("output_screen").value = basic_calc.clear();
    document.getElementById("input_box").focus();

});


//serverError listener for the clear button.
//add the input box content to the output screen.
document.getElementById("add_button").addEventListener("click", function () {
    var input_box = document.getElementById("input_box");
    if (input_box.value !== "") {
        document.getElementById("output_screen").value = basic_calc.add(parseInt(input_box.value));
        input_box.value = "";
    }
    input_box.focus();
});


//serverError listener for the clear button.
//multiply the input box content with the output screen content.
document.getElementById("multiply_button").addEventListener("click", function () {
    var input_box = document.getElementById("input_box");
    if (input_box.value !== "") {
        document.getElementById("output_screen").value = basic_calc.multiply(parseInt(input_box.value));
        input_box.value = "";
    }
    input_box.focus();
});


//serverError listener for the input box.
//validates that one enters only positive integers or zero to the input box.
//if the user enters something else it ignores it.
document.getElementById("input_box").addEventListener("keypress", function (evt) {
    var theEvent = evt || window.event;
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
    var regex = /[0-9]/;
    if (!regex.test(key)) {
        theEvent.returnValue = false;
        if(theEvent.preventDefault) {
            theEvent.preventDefault();
        }
    }
});