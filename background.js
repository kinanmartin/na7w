// When the extension is installed or upgraded ...
chrome.runtime.onInstalled.addListener(() => {
    // Create a context menu item for text selection
    chrome.contextMenus.create({
        id: "mark-parts-of-speech",
        title: "Mark parts of speech",
        contexts: ["selection"]
    });
});

// Add a listener for the context menu item click
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "mark-parts-of-speech" && info.selectionText) {
        // Send a message to the content script
        chrome.tabs.sendMessage(tab.id, { action: "MARK_TEXT", text: info.selectionText });
    }
});

// Listener for messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Handle messages as needed
    // Example: {action: "LOG", payload: "Some message"}
    if (message.action === "LOG") {
        console.log("Received message:", message.payload);
    }
});
