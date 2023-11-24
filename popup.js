document.addEventListener('DOMContentLoaded', function() {
    const markTextButton = document.getElementById('markText');
    const clearMarkingsButton = document.getElementById('clearMarkings');

    // markTextButton.addEventListener('click', function() {
    //     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    //         chrome.tabs.sendMessage(tabs[0].id, {action: "MARK_TEXT"});
    //     });
    // });

    clearMarkingsButton.addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: "CLEAR_MARKINGS"});
        });
    });
});
