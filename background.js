let APIKEY, EMAIL;

chrome.storage.onChanged.addListener(({apiKey, email}) => {
  if(apiKey) APIKEY = apiKey.newValue;
  if(email) EMAIL = email.newValue;
  if(APIKEY && EMAIL) {
    createMenuItem();
  } else {
    removeMenuItem()
  }
});


chrome.runtime.onInstalled.addListener(async () => {
  const [apiKeyData, emailData] = await Promise.all([
    chrome.storage.sync.get(['apiKey']),
    chrome.storage.sync.get(['email'])
  ]);

  APIKEY = apiKeyData.apiKey;
  EMAIL = emailData.email;

  if (APIKEY && EMAIL) {
    createMenuItem();
  }
});

chrome.contextMenus.onClicked.addListener((item, tab) => {
  const noteString = '<blockquote>' + item.selectionText + '</blockquote><br><a href="' + tab.url + '">' + tab.title + '</a>';
  fetch('https://productlane.com/api/v1/insights', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${APIKEY}`
    },
    body: JSON.stringify({
      text: noteString,
      painLevel: 'UNKNOWN',
      origin: 'API',
      contactEmail: EMAIL
    })
  });
});

function createMenuItem() {
  chrome.contextMenus.create({
    id: 'stp',
    title: 'Send To Productlane',
    type: 'normal',
    contexts: ['selection']
  });
}

function removeMenuItem() {
  chrome.contextMenus.remove('stp');
};