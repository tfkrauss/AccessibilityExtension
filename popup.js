document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('toggleButton');

  // Check if the extension is enabled from storage
  chrome.storage.local.get('isEnabled', (data) => {
    if (data.isEnabled) {
      toggleButton.textContent = 'Enabled';
      toggleButton.classList.remove('off');
    } else {
      toggleButton.textContent = 'Disabled';
      toggleButton.classList.add('off');
    }
  });

  // Toggle button click event
  toggleButton.addEventListener('click', () => {
    chrome.storage.local.get('isEnabled', (data) => {
      const newState = !data.isEnabled;
      chrome.storage.local.set({ isEnabled: newState }, () => {
        if (newState) {
          toggleButton.textContent = 'Enabled';
          toggleButton.classList.remove('off');
        } else {
          toggleButton.textContent = 'Disabled';
          toggleButton.classList.add('off');
        }
      });
    });
  });
});