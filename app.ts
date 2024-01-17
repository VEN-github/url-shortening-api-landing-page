type Link = {
  long: string;
  short: string;
};

const form = document.getElementById('link-form')! as HTMLFormElement;
const linkInput = document.getElementById('link-input')! as HTMLInputElement;
const shortenBtn = document.getElementById('shorten-btn')! as HTMLButtonElement;
const invalidMsg = document.getElementById('invalid-msg')! as HTMLParagraphElement;
const linksContainer = document.getElementById('links-container')! as HTMLDivElement;

const API_TOKEN = '28e395216c2b9927cbcfc41c0c58990b65d2cf22';
const API_URL = 'https://api-ssl.bitly.com/v4/shorten';

let timeout: undefined | number;
const links: Link[] = displayShortenUrl();
links.forEach(createShortenUrl);

form.addEventListener('submit', submitForm);

function submitForm(event: SubmitEvent) {
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

function isFormEmpty(value: string): Boolean {
  return value === '';
}

function isValidUrl(url: string): Boolean {
  const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

  return urlPattern.test(url);
}

function showInvalidMessage(message: string): void {
  linkInput.classList.add('form-invalid');
  invalidMsg.classList.remove('hidden');
  invalidMsg.textContent = message;

  clearInvalidMessage();
}

function clearInvalidMessage(): void {
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

async function shortenUrl(longUrl: string) {
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
    const newLinks: Link = {
      long: result.long_url,
      short: result.link,
    };

    links.push(newLinks);
    saveShortenUrl();
    createShortenUrl(newLinks);
    removeLoadingState();
  } catch (error: unknown) {
    removeLoadingState();
    if (error instanceof Error) {
      showInvalidMessage(error.message);
    } else {
      showInvalidMessage('An unknown error occurred.');
    }
  }
}

function createShortenUrl(link: Link): void {
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
    </div>
      `;

  linksContainer.classList.remove('hidden');
  const firstChild = linksContainer.firstChild;
  linksContainer.insertBefore(div, firstChild);
}

function saveShortenUrl(): void {
  localStorage.setItem('links', JSON.stringify(links));
}

function displayShortenUrl(): Link[] {
  const links = localStorage.getItem('links');

  return links ? JSON.parse(links) : [];
}
