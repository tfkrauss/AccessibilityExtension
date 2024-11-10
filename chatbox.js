// Function to create and inject the chatbox HTML
function createChatboxHTML() {
    const existingChatbox = document.querySelector('.chatbox-container');
    if (!existingChatbox) {
      const chatboxHTML = `
        <div class="chatbox-container">
          <div class="chatbox-header">
            <span>Chat with GPT</span>
            <div class="header-controls">
              <button class="minimize-chatbox">-</button>
              <button class="close-chatbox">×</button>
            </div>
          </div>
          <div id="chatboxMessages" class="chatbox-messages">
            <div class="messages-content"></div>
          </div>
          <div class="chatbox-input">
            <input type="text" id="chatInput" placeholder="Type your message...">
            <button id="sendChatMessage">Send</button>
          </div>
          <div class="resize-handle"></div>
        </div>
      `;
      
      const div = document.createElement('div');
      div.innerHTML = chatboxHTML;
      document.body.appendChild(div.firstElementChild);
  
      // Initialize resize functionality
      initializeResize();
    }
  }
  
  function initializeResize() {
    const chatbox = document.querySelector('.chatbox-container');
    const resizeHandle = document.querySelector('.resize-handle');
    let isResizing = false;
    let startX, startY, startWidth, startHeight;
  
    resizeHandle.addEventListener('mousedown', (e) => {
      isResizing = true;
      startX = e.clientX;
      startY = e.clientY;
      startWidth = chatbox.offsetWidth;
      startHeight = chatbox.offsetHeight;
  
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', () => {
        isResizing = false;
        document.removeEventListener('mousemove', handleMouseMove);
      });
    });
  
    function handleMouseMove(e) {
      if (!isResizing) return;
  
      const newWidth = startWidth + (e.clientX - startX);
      const newHeight = startHeight + (e.clientY - startY);
  
      // Set minimum sizes
      chatbox.style.width = Math.max(300, newWidth) + 'px';
      chatbox.style.height = Math.max(400, newHeight) + 'px';
    }
  }
  
  function initializeDrag() {
    const chatbox = document.querySelector('.chatbox-container');
    const header = document.querySelector('.chatbox-header');
    
    let isDragging = false;
    let startX, startY, startLeft, startTop;
  
    header.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startLeft = chatbox.offsetLeft;
      startTop = chatbox.offsetTop;
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    });
  
    function handleMouseMove(e) {
      if (!isDragging) return;
      
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      // Update position
      chatbox.style.left = startLeft + deltaX + 'px';
      chatbox.style.top = startTop + deltaY + 'px';
    }
  
    function handleMouseUp() {
      isDragging = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
  }
  
  
  // Create and append the chat button
  function createChatButton() {
    const existingButton = document.querySelector('.chat-button');
    if (!existingButton) {
      const chatButton = document.createElement('button');
      chatButton.className = 'chat-button';
      chatButton.textContent = 'Chat with GPT';
      chatButton.style.position = 'fixed';
      chatButton.style.bottom = '20px';
      chatButton.style.right = '20px';
      chatButton.style.padding = '10px';
      chatButton.style.backgroundColor = '#0078d4';
      chatButton.style.color = 'white';
      chatButton.style.border = 'none';
      chatButton.style.cursor = 'pointer';
      chatButton.style.zIndex = '999';
      chatButton.style.borderRadius = '4px';
      document.body.appendChild(chatButton);
      
      chatButton.addEventListener('click', openChatbox);
    }
  }
  
  // Initialize both the button and chatbox
  function initializeChatComponents() {
    createChatboxHTML();
    createChatButton();

    initializeDrag(); 
    initializeResize();
    
    // Initialize event listeners
    const sendButton = document.getElementById('sendChatMessage');
    if (sendButton) {
      sendButton.addEventListener('click', () => {
        const chatInput = document.getElementById('chatInput');
        const message = chatInput.value.trim();
        
        if (message) {
          sendMessage(message);
          chatInput.value = '';
        }
      });
    }
  
    // Add enter key support for sending messages
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
      chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          const message = chatInput.value.trim();
          if (message) {
            sendMessage(message);
            chatInput.value = '';
          }
        }
      });
    }
  
    const closeButton = document.querySelector('.close-chatbox');
    if (closeButton) {
      closeButton.addEventListener('click', closeChatbox);
    }
  }
  
  // Call initialization both immediately and after DOM content loads
  initializeChatComponents();
  
  document.addEventListener('DOMContentLoaded', initializeChatComponents);
  
  function openChatbox() {
    const chatbox = document.querySelector('.chatbox-container');
    if (chatbox) {
      chatbox.style.display = 'flex';
    } else {
      console.error('Chatbox container not found! Make sure the HTML structure is properly loaded.');
      // Try to recreate the chatbox if it's missing
      createChatboxHTML();
      const newChatbox = document.querySelector('.chatbox-container');
      if (newChatbox) {
        newChatbox.style.display = 'flex';
      }
    }
  }
  
  function closeChatbox() {
    const chatbox = document.querySelector('.chatbox-container');
    if (chatbox) {
      chatbox.style.display = 'none';
    }
  }
  
  async function sendMessage(message) {
    const chatboxMessages = document.getElementById('chatboxMessages');
    const messagesContent = chatboxMessages.querySelector('.messages-content');
    if (!messagesContent) return;
    
    // Store current scroll position and height
    const scrollPos = chatboxMessages.scrollTop;
    const shouldAutoScroll = chatboxMessages.scrollTop + chatboxMessages.clientHeight >= chatboxMessages.scrollHeight - 10;
    
    // Append user message
    const userMessage = document.createElement('div');
    userMessage.classList.add('user-message');
    userMessage.textContent = message;
    messagesContent.appendChild(userMessage);
  
    try {
      // Call ChatGPT API
      const response = await fetchChatGPTResponse(message);
      
      // Append bot message
      const botMessage = document.createElement('div');
      botMessage.classList.add('bot-message');
      botMessage.textContent = response;
      messagesContent.appendChild(botMessage);
      
      // Only auto-scroll if user was already at bottom
      if (shouldAutoScroll) {
        chatboxMessages.scrollTop = chatboxMessages.scrollHeight;
      } else {
        chatboxMessages.scrollTop = scrollPos;
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = document.createElement('div');
      errorMessage.classList.add('error-message');
      errorMessage.textContent = 'Failed to get response. Please try again.';
      messagesContent.appendChild(errorMessage);
    }
  }
  
  async function fetchChatGPTResponse(message) {
    const apiKey = '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';  // Replace with your actual API key
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [{ role: 'user', content: message }],
        }),
      });
  
      if (!response.ok) {
        throw new Error('API request failed');
      }
  
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }