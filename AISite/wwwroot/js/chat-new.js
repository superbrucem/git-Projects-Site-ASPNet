// New Chat functionality with simplified approach
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if we're on the chat page
    const chatContainer = document.getElementById('chatContainer');
    if (!chatContainer) return;

    const chatForm = document.getElementById('chatForm');
    const messageInput = document.getElementById('messageInput');
    const typingIndicator = document.getElementById('typingIndicator');
    const clearChatButton = document.getElementById('clearChat');

    // Auto-resize textarea
    messageInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        if (this.value === '') {
            this.style.height = '';
        }
    });

    // Submit form on Enter (but allow Shift+Enter for new line)
    messageInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submitMessage();
        }
    });

    // Handle form submission
    chatForm.addEventListener('submit', function(e) {
        e.preventDefault();
        submitMessage();
    });

    function submitMessage() {
        const message = messageInput.value.trim();
        if (!message) return;
        
        // Add user message to chat
        displayMessage('user', message);
        
        // Clear input
        messageInput.value = '';
        messageInput.style.height = '';
        
        // Show typing indicator
        typingIndicator.style.display = 'block';
        
        // Send message to server
        sendMessageToServer(message);
    }

    // Clear chat
    clearChatButton.addEventListener('click', function() {
        fetch('/Chat/ClearChat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(() => {
            window.location.reload();
        });
    });

    function displayMessage(role, content) {
        // Create message elements
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message ' + (role === 'user' ? 'user-message' : 'assistant-message');
        
        const flexDiv = document.createElement('div');
        flexDiv.className = 'flex items-start';
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'flex-shrink-0 mr-3';
        
        const iconContainer = document.createElement('div');
        iconContainer.className = role === 'user' 
            ? 'w-8 h-8 rounded-full bg-[#8AB4F8] flex items-center justify-center text-[#1E1F24]'
            : 'w-8 h-8 rounded-full bg-[#E8EAED] flex items-center justify-center text-[#1E1F24]';
        
        const icon = document.createElement('i');
        icon.className = role === 'user' ? 'fas fa-user' : 'fas fa-robot';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'flex-grow';
        
        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'bg-[#2D2F34] p-3 rounded-lg';
        
        const textP = document.createElement('p');
        textP.className = 'text-gray-200 whitespace-pre-wrap';
        textP.textContent = content;
        
        const timeDiv = document.createElement('div');
        timeDiv.className = 'text-xs text-gray-500 mt-1';
        timeDiv.textContent = new Date().toLocaleString();
        
        // Assemble the message
        iconContainer.appendChild(icon);
        avatarDiv.appendChild(iconContainer);
        
        bubbleDiv.appendChild(textP);
        contentDiv.appendChild(bubbleDiv);
        contentDiv.appendChild(timeDiv);
        
        flexDiv.appendChild(avatarDiv);
        flexDiv.appendChild(contentDiv);
        
        messageDiv.appendChild(flexDiv);
        
        // Remove empty state if present
        const emptyState = chatContainer.querySelector('.text-center.text-gray-500');
        if (emptyState && emptyState.parentElement && emptyState.parentElement.parentElement) {
            emptyState.parentElement.parentElement.remove();
        }
        
        // Add message to chat
        chatContainer.appendChild(messageDiv);
        
        // Scroll to bottom
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function sendMessageToServer(message) {
        fetch('/Chat/SendMessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Response received:', data);
            
            // Hide typing indicator
            typingIndicator.style.display = 'none';
            
            if (data.success && data.response) {
                // Add AI response to chat
                displayMessage('assistant', data.response.content);
                
                // Force browser to repaint
                document.body.style.minHeight = (document.body.scrollHeight + 1) + 'px';
                setTimeout(() => {
                    document.body.style.minHeight = '';
                }, 10);
            } else {
                // Show error
                displayMessage('assistant', 'Sorry, I encountered an error processing your request.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            
            // Hide typing indicator
            typingIndicator.style.display = 'none';
            
            // Show error
            displayMessage('assistant', 'Sorry, I encountered an error processing your request.');
        });
    }
});
