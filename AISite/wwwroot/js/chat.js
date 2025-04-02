// Chat functionality
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
        // Reset to default height if empty
        if (this.value === '') {
            this.style.height = '';
        }
    });

    // Submit form on Enter (but allow Shift+Enter for new line)
    messageInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            chatForm.dispatchEvent(new Event('submit'));
        }
    });

    // Handle form submission
    chatForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const message = messageInput.value.trim();
        if (!message) return;

        // Add user message to chat
        addMessageToChat('user', message);

        // Clear input
        messageInput.value = '';
        messageInput.style.height = '';

        // Show typing indicator
        typingIndicator.classList.remove('hidden');

        // Scroll to bottom
        scrollToBottom();

        // Send message to server
        sendMessageToServer(message);
    });

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

    function addMessageToChat(role, content) {
        const timestamp = new Date().toLocaleString();

        // Create message container
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${role === 'user' ? 'user-message' : 'assistant-message'}`;

        // Create message content
        const flexDiv = document.createElement('div');
        flexDiv.className = 'flex items-start';

        // Create avatar
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'flex-shrink-0 mr-3';

        const iconDiv = document.createElement('div');
        iconDiv.className = role === 'user'
            ? 'w-8 h-8 rounded-full bg-[#8AB4F8] flex items-center justify-center text-[#1E1F24]'
            : 'w-8 h-8 rounded-full bg-[#E8EAED] flex items-center justify-center text-[#1E1F24]';

        const icon = document.createElement('i');
        icon.className = role === 'user' ? 'fas fa-user' : 'fas fa-robot';

        iconDiv.appendChild(icon);
        avatarDiv.appendChild(iconDiv);

        // Create message body
        const bodyDiv = document.createElement('div');
        bodyDiv.className = 'flex-grow';

        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'bg-[#2D2F34] p-3 rounded-lg';

        const textP = document.createElement('p');
        textP.className = 'text-gray-200 whitespace-pre-wrap';
        textP.textContent = content;

        bubbleDiv.appendChild(textP);

        const timeDiv = document.createElement('div');
        timeDiv.className = 'text-xs text-gray-500 mt-1';
        timeDiv.textContent = timestamp;

        bodyDiv.appendChild(bubbleDiv);
        bodyDiv.appendChild(timeDiv);

        // Assemble the message
        flexDiv.appendChild(avatarDiv);
        flexDiv.appendChild(bodyDiv);
        messageDiv.appendChild(flexDiv);

        // Remove empty state if present
        const emptyState = chatContainer.querySelector('.text-center.text-gray-500');
        if (emptyState) {
            emptyState.parentElement.parentElement.remove();
        }

        // Append the message element
        chatContainer.appendChild(messageDiv);

        // Scroll to bottom
        scrollToBottom();

        // Force browser to repaint
        document.body.offsetHeight;
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
            console.log('Response data:', data); // Debug log

            // Hide typing indicator
            typingIndicator.classList.add('hidden');

            if (data.success && data.response) {
                // Add AI response to chat
                addMessageToChat('assistant', data.response.content);

                // Force a redraw of the chat container
                chatContainer.style.display = 'none';
                setTimeout(() => {
                    chatContainer.style.display = '';
                }, 10);
            } else {
                // Show error
                addMessageToChat('assistant', 'Sorry, I encountered an error processing your request.');

                // Force a redraw of the chat container
                chatContainer.style.display = 'none';
                setTimeout(() => {
                    chatContainer.style.display = '';
                }, 10);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            // Hide typing indicator
            typingIndicator.classList.add('hidden');
            // Show error
            addMessageToChat('assistant', 'Sorry, I encountered an error processing your request.');

            // Force a redraw of the chat container
            chatContainer.style.display = 'none';
            setTimeout(() => {
                chatContainer.style.display = '';
            }, 10);
        });
    }

    function scrollToBottom() {
        // Force a reflow to ensure the scrollHeight is calculated correctly
        void chatContainer.offsetHeight;

        // Scroll to bottom
        chatContainer.scrollTop = chatContainer.scrollHeight;

        // Sometimes the first scroll doesn't work, so we'll do it again after a short delay
        setTimeout(() => {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }, 50);
    }

    // Initial scroll to bottom
    scrollToBottom();
});
