"use strict";
const form = document.getElementById('link-form');
const linkInput = document.getElementById('link-input');
const invalidMsg = document.getElementById('invalid-msg');
let timeout;
form.addEventListener('submit', submitForm);
function submitForm(event) {
    event.preventDefault();
    clearTimeout(timeout);
    if (isFormEmpty(linkInput.value)) {
        showInvalidMessage('Please add a link');
        clearInvalidMessage();
        return;
    }
    if (!isValidUrl(linkInput.value)) {
        showInvalidMessage('URL is not valid');
        clearInvalidMessage();
        return;
    }
    shortenUrl();
}
function isFormEmpty(value) {
    return value.trim() === '';
}
function isValidUrl(url) {
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return urlPattern.test(url);
}
async function shortenUrl() {
    const url = 'https://cleanuri.com/api/v1/shorten';
    const payload = {
        url: 'http://google.com/',
    };
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        console.log(response);
    }
    catch (error) {
        console.log(error);
    }
}
function showInvalidMessage(message) {
    linkInput.classList.add('form-invalid');
    invalidMsg.classList.remove('hidden');
    invalidMsg.textContent = message;
    linkInput.focus();
}
function clearInvalidMessage() {
    timeout = setTimeout(() => {
        linkInput.classList.remove('form-invalid');
        invalidMsg.classList.add('hidden');
        invalidMsg.textContent = '';
    }, 3000);
}
