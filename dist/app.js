"use strict";
const form = document.getElementById('link-form');
const linkInput = document.getElementById('link-input');
const shortenBtn = document.getElementById('shorten-btn');
const invalidMsg = document.getElementById('invalid-msg');
const linksContainer = document.getElementById('links-container');
const menuBtn = document.getElementById('hamburger-btn');
const menu = document.getElementById('menu');
const API_TOKEN = '28e395216c2b9927cbcfc41c0c58990b65d2cf22';
const API_URL = 'https://api-ssl.bitly.com/v4/shorten';
let timeout;
const links = displayShortenUrl();
links.forEach(createShortenUrl);
form.addEventListener('submit', submitForm);
menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('is-active');
    menu.classList.toggle('hidden');
});
function submitForm(event) {
    event.preventDefault();
    clearTimeout(timeout);
    const longUrl = linkInput.value.trim();
    if (isFormEmpty(longUrl)) {
        showInvalidMessage('Please add a link.');
        linkInput.focus();
        return;
    }
    if (!isValidUrl(longUrl)) {
        showInvalidMessage('URL is not valid.');
        return;
    }
    shortenUrl(longUrl);
    form.reset();
}
function isFormEmpty(value) {
    return value === '';
}
function isValidUrl(url) {
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return urlPattern.test(url);
}
function showInvalidMessage(message) {
    linkInput.classList.add('form-invalid');
    invalidMsg.classList.remove('hidden');
    invalidMsg.textContent = message;
    clearInvalidMessage();
}
function clearInvalidMessage() {
    timeout = setTimeout(() => {
        linkInput.classList.remove('form-invalid');
        invalidMsg.classList.add('hidden');
        invalidMsg.textContent = '';
    }, 3000);
}
function showLoadingState() {
    linkInput.setAttribute('disabled', 'true');
    linkInput.classList.add('disabled');
    shortenBtn.setAttribute('disabled', 'true');
    shortenBtn.classList.add('disabled');
    shortenBtn.textContent = 'Loading...';
}
function removeLoadingState() {
    linkInput.removeAttribute('disabled');
    linkInput.classList.remove('disabled');
    shortenBtn.removeAttribute('disabled');
    shortenBtn.classList.remove('disabled');
    shortenBtn.textContent = 'Shorten it!';
}
async function shortenUrl(longUrl) {
    const payload = {
        long_url: longUrl,
        domain: 'bit.ly',
    };
    const options = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    };
    try {
        showLoadingState();
        const response = await fetch(API_URL, options);
        if (!response.ok) {
            throw new Error('Something went wrong. Please try again.');
        }
        const result = await response.json();
        const newLinks = {
            id: result.id,
            long: result.long_url,
            short: result.link,
        };
        links.push(newLinks);
        saveShortenUrl();
        createShortenUrl(newLinks);
        removeLoadingState();
    }
    catch (error) {
        removeLoadingState();
        if (error instanceof Error) {
            showInvalidMessage(error.message);
        }
        else {
            showInvalidMessage('An unknown error occurred.');
        }
    }
}
function createShortenUrl(link) {
    const div = document.createElement('div');
    div.className = 'link-card';
    div.innerHTML = `
    <a href="${link.long}" target="_blank" rel="noopener noreferrer" title="${link.long}" class="long-url">
      ${link.long}
    </a>
    <div class="action-container">
      <a href="${link.short}" target="_blank" rel="noopener noreferrer" title="${link.short}" class="short-url">
        ${link.short}
      </a>
      <button type="button" class="copy-btn">Copy</button>
      <button type="button" class="remove-btn">X</button>
    </div>
      `;
    linksContainer.classList.remove('hidden');
    const firstChild = linksContainer.firstChild;
    linksContainer.insertBefore(div, firstChild);
    const copyBtn = document.querySelector('.copy-btn');
    copyBtn?.addEventListener('click', (event) => copyLink(event, link.short));
    const removeBtn = document.querySelector('.remove-btn');
    removeBtn?.addEventListener('click', () => removeLink(link.id, div));
}
function saveShortenUrl() {
    localStorage.setItem('links', JSON.stringify(links));
}
function displayShortenUrl() {
    const links = localStorage.getItem('links');
    return links ? JSON.parse(links) : [];
}
async function copyLink(event, link) {
    try {
        await navigator.clipboard.writeText(link);
        const element = event.target;
        element.classList.add('copied');
        element.textContent = 'Copied!';
    }
    catch (error) {
        alert('Unable to copy to clipboard.');
    }
}
function removeLink(id, element) {
    const index = links.findIndex(link => link.id === id);
    if (index < 0)
        return;
    links.splice(index, 1);
    element.remove();
    saveShortenUrl();
    if (linksContainer.children.length === 0)
        linksContainer.classList.add('hidden');
}
