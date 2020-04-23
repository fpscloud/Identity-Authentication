//Js-Meta

<?xml version="1.0" encoding="UTF-8" ?>
<LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata" fqn="callAuthenticator">
    <apiVersion>48.0</apiVersion>
    <isExposed>true</isExposed>
    <targets>
        <target>lightning__AppPage</target>
        <target>lightning__RecordPage</target>
        <target>lightning__HomePage</target>
    </targets>
</LightningComponentBundle>

//JS


import { LightningElement } from 'lwc';

//-- API Details --//
const apiUrl = '';
const apiVer = '';
const tenantID = '';
const apiKey = '';

export default class CallAuthenticator extends LightningElement {
    passKey = 'Enter Pass-Key';
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
        fetch(apiUrl + '/' + apiVer + '/' + tenantID + '/verify/' + this.passKey, {
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