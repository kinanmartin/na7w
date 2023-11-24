// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "MARK_TEXT") {
        // Function to mark the parts of speech in the selected text
        markText(message.text);
    }
});

function markText(selectedText) {
    // Define the server URL
    const serverUrl = 'http://localhost:8238/tag';

    // Send a POST request to the server
    fetch(serverUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: selectedText })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(taggedData => {
        // Process the tagged data and apply color coding
        const taggedHtml = createTaggedHtml(taggedData);
        replaceSelectedText(taggedHtml);
    })
    .catch(error => {
        console.error('Error while tagging text:', error);
    });
}

function createTaggedHtml(taggedData) {
    // Transform the tagged data into HTML, color-coding nouns and verbs
    return taggedData.map(([word, tag]) => {
        const color = tag.startsWith('N') ? 'cyan' : tag.startsWith('V') ? 'green' : 'pink';
        return `<span style="background: ${color};">${word}</span>`;
    }).join(' ');
}

function replaceSelectedText(replacementHtml) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = replacementHtml;

    // Create a document fragment to hold the nodes
    const fragment = document.createDocumentFragment();
    while (tempDiv.firstChild) {
        // Append nodes to the fragment
        fragment.appendChild(tempDiv.firstChild);
    }

    // Delete the original contents of the range
    range.deleteContents();

    // Insert the fragment (which preserves the order of nodes)
    range.insertNode(fragment);

    // Clear the selection
    selection.removeAllRanges();
    selection.addRange(range);
}


