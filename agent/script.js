const passKey = document.querySelector('#passKey');
const passKeyError = document.querySelector('.passKey__error');

const pass_phraseContainer = document.querySelector('#widget__phrase-container');

const form = document.querySelector('#agentForm');
const message = document.querySelector('.widget__message');

let timeOut;


// API Details
const apiUrl = '';
const apiVer = '';
const tenantID = '';
const apiKey = '';

const URL = `${apiUrl}/${apiVer}/${tenantID}`


// Form Submit Message
const showMessage = (type, err) => {

    console.log(type, err);
    message.removeChild(message.childNodes[0]);
    let div = document.createElement('div');
    let img = document.createElement('img');
    if (type == "success") {
        img.src = "check.png";
        const text = document.createTextNode("Form Submitted Successfully");
        div.appendChild(img);
        div.appendChild(text);
    } else if (type == "error") {
        img.src = "error.png";
        const text = document.createTextNode(`${err}`);
        div.appendChild(img);
        div.appendChild(text);
    }

    message.appendChild(div);
    message.style.visibility = "visible";
    timeOut = setTimeout(function () {
        message.style.visibility = "hidden";
    }, 3000);
}


// Form Submit
const getData = (event) => {

    event.preventDefault();
    clearTimeout(timeOut);
    pass_phraseContainer.innerText = "";

    axios.get(`${URL}/identity/passcode/${passKey.value}`, {
        headers: {
            'x-api-key': apiKey
        }
    }).then(response => {
        console.log(response.data);
        const passPh = response.data.pass_phrase;
        pass_phraseContainer.innerText = passPh;
        showMessage("success", "none");
    }).catch(err => {
        console.log(err.response);
        let msg = '';
        msg = err.response.data.message;
        showMessage("error", msg);
    });
};

form.addEventListener('submit', getData);


//Error Handling
const onBlur = (field, errField, type, min, max) => {

    let val = field.value;
    if (val != '') {
        let length = val.toString().length;
        if (!(length >= min && length <= max)) {
            errField.style.visibility = "visible";
            errField.innerText = `Please enter ${type} between ${min} and ${max} characters length`;
        }
    } else {
        errField.style.visibility = "visible";
        errField.innerText = "This field cannot be left empty";
    }
}


const onFocus = (errField) => {
    errField.style.visibility = "hidden";
    errField.innerText = "";
}


passKey.addEventListener('blur', function () {
    onBlur(passKey, passKeyError, "number", 4, 10);
})
passKey.addEventListener('focus', function () {
    onFocus(passKeyError);
})


//Function to not let the user type in letters
function setInputFilter(textbox, inputFilter) {
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function (event) {
        textbox.addEventListener(event, function () {
            if (inputFilter(this.value)) {
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            } else {
                this.value = "";
            }
        });
    });
}
setInputFilter(passKey, function (value) {
    return /^-?\d*$/.test(value);
});
