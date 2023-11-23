// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "MARK_TEXT") {
        // Function to mark the parts of speech in the selected text
        markText(message.text);
    }
});

function markText(selectedText) {
    // TODO: Implement the logic to send the selected text to your server-side script
    // and receive the parts of speech tagging.

    // Example of how you might apply color coding to the text
    // This is a placeholder; you will replace it with your actual logic.
    const taggedText = applyDummyTagging(selectedText);

    // Replace the selected text with the color-coded version
    replaceSelectedText(taggedText);
}

function applyDummyTagging(text) {
    // Dummy function for demonstration purposes
    // Replace this with the actual response from your server-side script
    return text.split(' ').map(word => `<span style="background: ${getRandomColor()}">${word}</span>`).join(' ');
}

function getRandomColor() {
    // Function to generate a random color for demonstration
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// function replaceSelectedText(replacementHtml) {
//     // Function to replace the selected text with the color-coded version
//     // This is a simplified version; you may need more complex logic depending on the page structure
//     const range = window.getSelection().getRangeAt(0);
//     const span = document.createElement('span');
//     span.innerHTML = replacementHtml;
//     range.deleteContents();
//     range.insertNode(span);
// }

function replaceSelectedText(replacementHtml) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const container = document.createElement("div");

    // Clone the range contents to a temporary container
    container.appendChild(range.cloneContents());

    // Function to recursively apply the replacement to each text node
    function applyReplacement(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            // Split the text node into individual words and wrap them in spans
            const words = node.nodeValue.split(' ').map(word => {
                const span = document.createElement('span');
                span.innerHTML = word;
                span.style.background = getRandomColor(); // Replace with your actual logic
                return span.outerHTML;
            }).join(' ');
            const wrapper = document.createElement('span');
            wrapper.innerHTML = words;
            node.parentNode.replaceChild(wrapper, node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            Array.from(node.childNodes).forEach(applyReplacement);
        }
    }

    Array.from(container.childNodes).forEach(applyReplacement);

    // Replace the original contents of the range with the new container contents
    range.deleteContents();

    // Instead of inserting each node, append the whole container
    const fragment = document.createDocumentFragment();
    while (container.firstChild) {
        fragment.appendChild(container.firstChild);
    }
    range.insertNode(fragment);

    // Clear selection
    selection.removeAllRanges();
    selection.addRange(range);
}



