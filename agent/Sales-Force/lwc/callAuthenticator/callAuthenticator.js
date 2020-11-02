import { LightningElement, track, wire } from 'lwc';

const apiUrl = '';
const apiVer = '';
const tenantID = '';
const apiKey = '';

export default class CallAuthenticator extends LightningElement {
    passKey = '********';
    passPhrase;
    error;

    handlePassKeyChange(event) {
        this.passKey = event.target.value;
    }

    handlePassClick() {
        // Reset error panel
        if (typeof this.error != 'undefined') {
            this.error = undefined;
        }

        // Fetch pass phrase
        fetch(apiUrl + '/' + apiVer + '/' + tenantID + '/identity/passcode/' + this.passKey, {
                method: 'GET',
                headers: {
                    'x-api-key': apiKey
                }
            }).then(response => {
                if (!response.ok) {
                    this.error = response;
                }
                return response.json();
            })
            .then(jsonResponse => {
                this.passPhrase = jsonResponse;
            })
            .catch(error => {
                this.error = error;
                this.passPhrase = undefined;
            });
    }
}