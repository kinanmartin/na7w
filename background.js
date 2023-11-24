// When the extension is installed or upgraded ...
chrome.runtime.onInstalled.addListener(() => {
    // Create context menu items
    chrome.contextMenus.create({
        id: "mark-parts-of-speech",
        title: "Mark parts of speech",
        contexts: ["selection"]
    });
    // chrome.contextMenus.create({
    //     id: "clear-markings",
    //     title: "Clear markings",
    //     contexts: ["all"]
    // });
});

// Add a listener for the context menu item click
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "mark-parts-of-speech" && info.selectionText) {
        chrome.tabs.sendMessage(tab.id, { action: "MARK_TEXT", text: info.selectionText });
    } else if (info.menuItemId === "clear-markings") {
        chrome.tabs.sendMessage(tab.id, { action: "CLEAR_MARKINGS" });
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
