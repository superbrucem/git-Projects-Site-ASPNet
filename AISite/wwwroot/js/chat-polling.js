// Enhanced chat functionality with polling mechanism
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if we're on the chat page
    const chatContainer = document.getElementById('chatContainer');
    if (!chatContainer) return;

    const chatForm = document.getElementById('chatForm');
    const messageInput = document.getElementById('messageInput');
    const typingIndicator = document.getElementById('typingIndicator');
    const clearChatButton = document.getElementById('clearChat');

    // Global variable to track if we're waiting for a response
    window.waitingForResponse = false;

    // Focus the input field when the page loads
    setTimeout(() => {
        messageInput.focus();
    }, 500);

    // Auto-resize textarea with smooth animation
    messageInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        if (this.value === '') {
            this.style.height = '60px'; // Match the min-height in CSS
        }
    });

    // Submit form on Enter (but allow Shift+Enter for new line)
    messageInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submitMessage();
        }

        // Add visual feedback when typing
        if (!this.classList.contains('typing')) {
            this.classList.add('typing');
            this.style.borderColor = 'rgba(99, 102, 241, 0.5)';

            // Reset after a delay
            clearTimeout(this.typingTimer);
            this.typingTimer = setTimeout(() => {
                this.classList.remove('typing');
                this.style.borderColor = '';
            }, 1000);
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

        // Add a subtle animation to the submit button
        const submitButton = document.querySelector('#chatForm button[type="submit"]');
        submitButton.classList.add('animate-ping');
        setTimeout(() => {
            submitButton.classList.remove('animate-ping');
        }, 300);

        // Set the waiting flag
        window.waitingForResponse = true;

        // Clear input
        messageInput.value = '';
        messageInput.style.height = '60px'; // Reset to default height

        // Show typing indicator with fade-in
        typingIndicator.style.opacity = '0';
        typingIndicator.style.display = 'block';
        setTimeout(() => {
            typingIndicator.style.opacity = '1';
            typingIndicator.style.transition = 'opacity 0.3s ease-in-out';
        }, 10);

        // Scroll to bottom with smooth animation
        scrollToBottom();

        // Send message to server
        sendMessageToServer(message);
    }

    // Clear chat with confirmation
    clearChatButton.addEventListener('click', function() {
        // Add a subtle animation to the button
        this.classList.add('scale-95');
        setTimeout(() => {
            this.classList.remove('scale-95');
        }, 200);

        // Ask for confirmation
        if (confirm('Are you sure you want to clear the chat history?')) {
            // Show loading state
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span class="ml-2">Clearing...</span>';
            this.disabled = true;

            fetch('/Chat/ClearChat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(() => {
                window.location.reload();
            }).catch(() => {
                // Reset button if there's an error
                this.innerHTML = '<i class="fas fa-trash-alt"></i><span class="ml-2">Clear Chat</span>';
                this.disabled = false;
            });
        }
    });

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

            // Reset the waiting flag
            window.waitingForResponse = false;

            // Force reload to show the new messages
            window.location.reload();
        })
        .catch(error => {
            console.error('Error:', error);

            // Hide typing indicator
            typingIndicator.style.display = 'none';

            // Reset the waiting flag
            window.waitingForResponse = false;

            // Force reload to show error message
            window.location.reload();
        });
    }

    // Enhanced scroll to bottom with smooth animation
    function scrollToBottom() {
        chatContainer.scrollTo({
            top: chatContainer.scrollHeight,
            behavior: 'smooth'
        });

        // Double-check scroll position after a short delay
        setTimeout(() => {
            chatContainer.scrollTo({
                top: chatContainer.scrollHeight,
                behavior: 'smooth'
            });
        }, 100);
    }

    // Initial scroll to bottom
    scrollToBottom();

    // Add scroll shadow effect
    chatContainer.addEventListener('scroll', function() {
        if (this.scrollTop > 20) {
            this.classList.add('shadow-inner');
        } else {
            this.classList.remove('shadow-inner');
        }
    });
});
