var form = document.getElementById("form");
var inputEmail = document.getElementById("email");
var inputMessage = document.getElementById("message");

var statusMessage = document.getElementById("statusmessage");
var statusContainer = document.getElementById("status");
var buttonSubmit = document.getElementById("submit");

async function validateEmail() {
    inputEmail.classList.remove("is-danger");
    inputEmail.classList.remove("is-success");
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(inputEmail.value)) {
        inputEmail.classList.add("is-success");
        return true;
    }
    else {
        inputEmail.classList.add("is-danger");
        return false;
    }
}

async function validateMessage() {
    inputMessage.classList.remove("is-danger");
    inputMessage.classList.remove("is-success");
    if (inputMessage.value.length > 0) {
        inputMessage.classList.add("is-success");
        return true;
    }
    else {
        inputMessage.classList.add("is-danger");
        return false;
    }
}

async function validateInput() {
    var email = await validateEmail();
    var message = await validateMessage();

    if (!email || !message) {
        return false;
    }
    else {
        return true;
    }
}
/*
function resetStatus() {
    statusContainer.style.display = "none";
    statusContainer.classList.remove("is-success");
    statusContainer.classList.remove("is-danger");

    inputEmail.classList.remove("is-danger");
    inputEmail.classList.remove("is-success");
    inputMessage.classList.remove("is-danger");
    inputMessage.classList.remove("is-success");
}
*/

function displayStatus(text, success) {
    statusContainer.style.display = "block";
    if (success) {
        statusContainer.classList.add("is-success");
    }
    else {
        statusContainer.classList.add("is-danger");
    }
    statusMessage.innerHTML = text;
}

async function handleSubmit(event) {
    event.preventDefault();
    let validation = await validateInput();
    
    if (validation) {
        buttonSubmit.classList.add("is-static");

        var data = new FormData(event.target);

        fetch(event.target.action, {
            method: form.method,
            body: data,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                displayStatus("Tak for din besked.", true);
                form.reset();
                inputEmail.disabled = true;
                inputMessage.disabled = true;
            }
            else {
                response.json().then(data => {
                    if (Object.hasOwn(data, 'errors')) {
                        var errorMessage = data["errors"].map(error => error["message"]).join(", ");
                        displayStatus(errorMessage, false);

                    } else {
                        displayStatus("Der er sket en fejl, prøv igen senere.", false);
                    }
                })
            }
        }).catch(error => {
            displayStatus("Der er sket en fejl, prøv igen senere.", false);
        });
    }
}