// Chat Widget Script Completo
(function() {
    // Injeção de estilos e fontes
    const styles = `
        .chat-widget {
            --chat--color-primary: var(--chat-primary-color, #854fff);
            --chat--color-secondary: var(--chat-secondary-color, #6b3fd4);
            --chat--color-background: var(--chat-background-color, #ffffff);
            --chat--color-font: var(--chat-font-color, #333333);
            font-family: 'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }

        .chat-widget .chat-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            display: none;
            width: 380px;
            height: 600px;
            background: var(--chat--color-background);
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(133, 79, 255, 0.15);
            border: 1px solid rgba(133, 79, 255, 0.2);
            overflow: hidden;
        }

        .chat-widget .chat-container.open {
            display: flex;
            flex-direction: column;
        }

        .chat-widget .brand-header {
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            border-bottom: 1px solid rgba(133, 79, 255, 0.1);
        }

        .chat-widget .new-chat-btn {
            padding: 16px 24px;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 500;
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Criando o Widget
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'chat-widget';

    const chatContainer = document.createElement('div');
    chatContainer.className = 'chat-container';
    chatContainer.innerHTML = `
        <div class="brand-header">
            <img src="https://avatars.githubusercontent.com/u/57262511?v=4" alt="Rebecca">
            <span>Rebecca</span>
            <button class="close-button">×</button>
        </div>
        <div class="new-conversation">
            <h2 class="welcome-text">Olá 👋, como podemos ajudar?</h2>
            <button class="new-chat-btn">Send us a message</button>
        </div>
    `;
    widgetContainer.appendChild(chatContainer);
    document.body.appendChild(widgetContainer);

    // Eventos
    const newChatBtn = document.querySelector('.new-chat-btn');
    const closeButton = document.querySelector('.close-button');
    
    newChatBtn.addEventListener('click', () => {
        chatContainer.classList.add('open');
    });

    closeButton.addEventListener('click', () => {
        chatContainer.classList.remove('open');
    });

    // Notificação com som e vibração
    const notificationSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    function triggerNotification() {
        if (!chatContainer.classList.contains('open')) {
            notificationSound.play().catch(err => console.log('Erro ao tocar som:', err));
        }
    }
    setTimeout(triggerNotification, 25000); // Notifica após 25s
})();
