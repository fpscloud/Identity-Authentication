const form = document.querySelector('#clientForm');

// Pass Key Elements
const passKey = document.querySelector('#passKey');
const passKeyError = document.querySelector('.passKey__error');

// Pass Code Elements
const passPhrase = document.querySelector('#passPhrase');
const passPhraseError = document.querySelector('.passPhrase__error');
const pass_control_container = document.querySelector('#pass_control_container');

// Button Container & Elements
const pass_phraseContainer = document.querySelector('#widget__phrase-container');
const button = document.querySelector('#button');
const message = document.querySelector('.widget__message');



const confirmationIDBox = document.querySelector('#confirmationIDBox');
const createdID = document.querySelector('#createdID');
const rightBox = document.querySelector('#rightBox');
const finaleBox = document.querySelector('#finaleBox');
const contentBox_left = document.querySelector('#contentBox_left');
const contentBox_right = document.querySelector('#contentBox_right');


// Function Declration. This Function clears the Form Submit Message
let timeOut;

// Pass Code Config retrieved from Config API
let configuration = {};

// API Details
const apiUrl = '';
const apiVer = '';
const tenantID = '';
const URL = `${apiUrl}/${apiVer}/${tenantID}`


// Form Submit Message
const showMessage = (type, err) => {
    let div = document.createElement('div');
    let img = document.createElement('img');
    if (type == "success") {
        img.src = "check.png";
        const text = document.createTextNode("Form Submitted Successfully");
        div.appendChild(img);
        div.appendChild(text);
    } else if (type == "error") {
        const data = err.join(', ');
        const text = document.createTextNode(`${data}`);
        div.appendChild(text);
        passKeyError.appendChild(text);
        passKeyError.style.visibility = "visible";
        pass_phraseContainer.innerText = "XXXX";
    }

    message.style.visibility = "visible";
    timeOut = setTimeout(function () {
        passKeyError.style.visibility = "hidden";
    }, 5000);
}


// If PassCode is Manual
const passCodeIsManual = () => {
    const passPhraseType = configuration['pass_pharse_allowed_characters'];
    const passPhraseLength = configuration['pass_phrase_length'];
    if (passPhraseType === 'numeric') {
        passPhrase.setAttribute('placeholder', `Please enter number between 3 and ${passPhraseLength} characters length`);
        setInputFilter(passPhrase, function (value) {
            return /^-?\d*$/.test(value);
        });
    } else if (passPhraseType === 'alphabets') {
        passPhrase.setAttribute('placeholder', `Please enter text between 3 and ${passPhraseLength} characters length`);
    } else if (passPhraseType === 'alphanumeric') {
        passPhrase.setAttribute('placeholder', `Pass-code must be between 3 and ${passPhraseLength} characters length`);
    }
}


// Check Passcode Config
const checkConfiguration = (configuration) => {
    const passPhraseCondition = configuration['pass_phrase'];
    const passPhraseLength = configuration['pass_phrase_length'];
    if (passPhraseCondition === 'system') {
        button.innerText = 'Create ID';
    } else if (passPhraseCondition === 'manual') {
        passCodeIsManual();
        passPhrase.setAttribute('maxlength', `${passPhraseLength}`);
        button.innerText = 'Submit';
        pass_control_container.classList.remove('hide');
    }
    document.querySelector('.widget__box').classList.remove('loading');
}


// Get Passcode Config
const getConfiguration = () => {
    axios.get(
        `${URL}/identity/passcode/config`
    ).then(response => {
        configuration = JSON.parse(response.data.tenant_config_details);
        checkConfiguration(configuration);
    }).catch(err => {
        console.log(err);
    });
}


// Form Submit
const sendData = (event) => {
    event.preventDefault();
    clearTimeout(timeOut);
    pass_phraseContainer.innerText = "";
    const passPhraseCondition = configuration['pass_phrase'];
    axios.post(
        `${URL}/identity/passcode`, {
            "key": `${passKey.value}`,
            "pass_phrase": `${passPhrase.value}`,
        }
    ).then(response => {
        if (passPhraseCondition === 'system') {
            const passPh = response.data.data.pass_phrase;
            rightBox.style.opacity = "1";
            pass_phraseContainer.innerText = passPh;
            form.style.display = "none";
            createdID.innerText = `${passKey.value}`;
            confirmationIDBox.style.display = "block";
        }
        showMessage("success", "none");
    }).catch(err => {
        let errArr = err.response.data.message;

        Object.values(errArr).forEach(value => {
            //console.log(value);
            showMessage("error", value);
        })
    });
};


function finaleEvent() {
    contentBox_left.style.display = "none";
    contentBox_right.style.display = "none";
    finaleBox.style.display = "block"
}


// Error Handling
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

// Function to not let the user type in letters
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

// Init
getConfiguration();

setInputFilter(passKey, function (value) {
    return /^-?\d*$/.test(value);
});

passKey.addEventListener('blur', function () {
    onBlur(passKey, passKeyError, "number", 4, 10);
});
passKey.addEventListener('focus', function () {
    onFocus(passKeyError);
});
passPhrase.addEventListener('blur', function () {
    onBlur(passPhrase, passPhraseError, "text", 3, configuration["pass_phrase_length"]);
});
passPhrase.addEventListener('focus', function () {
    onFocus(passPhraseError);
});

form.addEventListener('submit', sendData);
