     // Tab Switching
        const tabs = document.querySelectorAll('.tab');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.getAttribute('data-tab');
                
                // Remove active class from all tabs and contents
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                tab.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });
        
        // Message Modal
        const viewMessageBtns = document.querySelectorAll('.view-message-btn');
        const messageModal = document.getElementById('messageModal');
        const fullMessageText = document.getElementById('fullMessageText');
        const closeModal = document.getElementById('closeModal');
        
        viewMessageBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const message = btn.getAttribute('data-message');
                fullMessageText.textContent = message;
                messageModal.style.display = 'flex';
            });
        });
        
        closeModal.addEventListener('click', () => {
            messageModal.style.display = 'none';
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === messageModal) {
                messageModal.style.display = 'none';
            }
        });
        
        // Home Button
        document.getElementById('homeBtn').addEventListener('click', () => {
            window.location.href = '../index.html';
        });