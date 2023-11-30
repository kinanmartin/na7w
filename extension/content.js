localhost = 8238

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "MARK_TEXT") {
        console.log(message)
        markText(message.text);
    } else if (message.action === "CLEAR_MARKINGS") {
        clearMarkings();
    }
});

function markText(selectedText) {
    // Define the server URL
    const serverUrl = `http://127.0.0.1:${localhost}/tag`;

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
        // After marking the text, clear the selection
        window.getSelection().removeAllRanges();
    })
    .catch(error => {
        console.error('Error while tagging text:', error);
    });
}

function clearMarkings() {
    // Find all <span> elements added by the extension and revert the changes
    const markedSpans = document.querySelectorAll('span.added-by-na7w'); // Use a specific class to identify your spans
    markedSpans.forEach(span => {
        const parent = span.parentNode;
        while (span.firstChild) {
            parent.insertBefore(span.firstChild, span);
        }
        parent.removeChild(span);
    });
}

function createTaggedHtml(taggedData) {
    // Transform the tagged data into HTML, color-coding nouns and verbs
    return taggedData.map(token => {
        // Process each token, which may contain multiple words
        const tokenHtml = token.map(([word, tag]) => {
            const color = 
                tag.startsWith('N') ? 'aqua' : 
                tag.startsWith('V') ? 'red' : 
                tag.startsWith('A') ? 'lime' : 
                tag.startsWith('C') ? 'yellow' : 
                tag.startsWith('X') ? 'fuchsia' : 
                tag.startsWith('P') ? 'orange' : 
                tag.startsWith('SP') ? 'dodgerblue' : 
                tag.startsWith('SR') ? 'blueviolet' : 
                tag.startsWith('SD') ? 'plum' : 
                'inherit';
                return `<span class="added-by-na7w" style="background: ${color};">${word}</span>`;
        }).join('');

        return tokenHtml;
    }).join('');
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


