const passPhrase = document.querySelector('#passPhrase');
const passKey = document.querySelector('#passKey');
const form = document.querySelector('#clientForm');

const message = document.querySelector('.widget__message');
const error = document.querySelector('.widget__error');
const button_container = document.querySelector('#button_container');
const pass_phraseContainer = document.querySelector('#widget__phrase-container');
let configuration = {};

//-- API Details --//
const apiUrl = '';
const apiVer = '';
const tenantID = '';



const showMessage = (type, err) => {
    //console.log(type, err);
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
    setTimeout(function () {
        message.style.visibility = "hidden";
    }, 3000);
}



const sendData = (event) => {
    event.preventDefault();
    const passPhraseCondition = configuration['pass_phrase'];
    axios.post(
        `${apiUrl}/${apiVer}/tenant/${tenantID}/trust`, {
            "pass_key": `${passKey.value}`,
            "pass_phrase": `${passPhrase.value}`,
        }
    ).then(response => {
        if (passPhraseCondition === 'system') {
            showMessage("success", "none");
        } else {
            const passPh = response.data.data.pass_phrase;
            var displayPassPhrase = document.createElement('span');
            displayPassPhrase.appendChild(document.createTextNode(passPh));
            pass_phraseContainer.appendChild(displayPassPhrase);
        }
        //console.log(response.data.data.pass_phrase);
    }).catch(err => {
        let msg = '';
        if (err.response.status === 409) {
            msg = err.response.data.message;
        } else if (err.response.status === 400) {
            msg = err.response.data.errors.pass_key;
        }

         //console.log(err.response);
        showMessage("error", msg);
    });
};

form.addEventListener('submit', sendData);


const passKeyError = document.querySelector('.passKey__error');
const passPhraseError = document.querySelector('.passPhrase__error');

passKey.onblur = function () {
    let val = passKey.value;
    //console.log(val);
    if (val != '') {
        if (isNaN(val)) {
            passKeyError.style.visibility = "visible";
            passKeyError.innerText = "Please enter numbers only";
        } else {

            let length = val.toString().length;

            if (length >= 4 && length <= 10) {
                //console.log(length);
            } else {
                passKeyError.style.visibility = "visible";
                passKeyError.innerText = "Please enter number between 4 and 10 characters length";
            }
        }
    } else {
        passKeyError.style.visibility = "visible";
        passKeyError.innerText = "This field cannot be left empty";
    }
};

passKey.onfocus = function () {
    passKeyError.style.visibility = "hidden";
    passKeyError.innerText = "";
};

passPhrase.onblur = function () {
    let val = passPhrase.value;
    if (val != '') {
        let length = val.toString().length;

        if (length >= 6 && length <= 20) {
            //console.log(length);
        } else {
            passPhrase.classList.add('invalid');
            passPhraseError.style.opacity = "1";
            passPhraseError.innerHTML = "Please enter text between 6 and 20 characters length";
        }

    } else {
        passPhrase.classList.add('invalid');
        passPhraseError.style.opacity = "1";
        passPhraseError.innerHTML = "This field cannot be left empty";
    }
};

passPhrase.onfocus = function () {
    if (this.classList.contains('invalid')) {
        this.classList.remove('invalid');
        passPhraseError.style.opacity = "0";
        passPhraseError.innerHTML = "";
    }
};


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

function getconfiguration() {
    axios.get(
        `${apiUrl}/${apiVer}/tenant/${tenantID}/config`
    ).then(response => {
        configuration = JSON.parse(response.data.tenant_config_details);
        checkForManual(configuration);

    }).catch(err => {
        setTimeout(function () {}, 3000);
        console.error(err);
    });
}

function checkForManual(configuration) {

    var b = document.querySelector('.sButton');
    const passPhraseCondition = configuration['pass_phrase'];
    if (passPhraseCondition === 'system') {
        b.innerText = 'Generate Pass-Phrase';
        passPhrase.classList.add('hide')
    } else if (passPhraseCondition === 'manual') {
        b.innerText = 'Submit';
        pass_phraseContainer.classList.remove('hide');
    }
    document.querySelector('.widget__box').classList.remove('loading');
}
getconfiguration();
setInputFilter(passKey, function (value) {
    return /^-?\d*$/.test(value);
});
