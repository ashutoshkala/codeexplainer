document.getElementById('saveButton').addEventListener('click', () => {
    const apiKey = document.getElementById('apiKey').value;
    if (apiKey) {
        chrome.storage.local.set({ apiKey: apiKey }, () => {
            alert('API key saved!');
        });
    } else {
        alert('Please enter a valid API key.');
    }
});

document.getElementById('updateButton').addEventListener('click', () => {
    const apiKey = document.getElementById('apiKey').value;
    if (apiKey) {
        chrome.storage.local.set({ apiKey: apiKey }, () => {
            alert('API key updated!');
        });
    } else {
        alert('Please enter a valid API key.');
    }
});
