// Chat Widget Script Completo com Notificação, Vibração e Som
(function() {
    // 1. Injeção de estilos e fontes
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
            font-family: inherit;
        }
        .chat-widget .chat-container.position-left {
            right: auto;
            left: 20px;
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
            position: relative;
        }
        .chat-widget .close-button {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: var(--chat--color-font);
            cursor: pointer;
            padding: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.2s;
            font-size: 20px;
            opacity: 0.6;
        }
        .chat-widget .close-button:hover {
            opacity: 1;
        }
        .chat-widget .brand-header img {
            width: 32px;
            height: 32px;
        }
        .chat-widget .brand-header span {
            font-size: 18px;
            font-weight: 500;
            color: var(--chat--color-font);
        }
        .chat-widget .new-conversation {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 20px;
            text-align: center;
            width: 100%;
            max-width: 300px;
        }
        .chat-widget .welcome-text {
            font-size: 24px;
            font-weight: 600;
            color: var(--chat--color-font);
            margin-bottom: 24px;
            line-height: 1.3;
        }
        .chat-widget .new-chat-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
            padding: 16px 24px;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            transition: transform 0.3s;
            font-weight: 500;
            font-family: inherit;
            margin-bottom: 12px;
        }
        .chat-widget .new-chat-btn:hover {
            transform: scale(1.02);
        }
        .chat-widget .message-icon {
            width: 20px;
            height: 20px;
        }
        .chat-widget .response-text {
            font-size: 14px;
            color: var(--chat--color-font);
            opacity: 0.7;
            margin: 0;
        }
        .chat-widget .chat-interface {
            display: none;
            flex-direction: column;
            height: 100%;
        }
        .chat-widget .chat-interface.active {
            display: flex;
        }
        .chat-widget .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            background: var(--chat--color-background);
            display: flex;
            flex-direction: column;
        }
        .chat-widget .chat-message {
            padding: 12px 16px;
            margin: 8px 0;
            border-radius: 12px;
            max-width: 80%;
            word-wrap: break-word;
            font-size: 14px;
            line-height: 1.5;
        }
        .chat-widget .chat-message.user {
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            align-self: flex-end;
            box-shadow: 0 4px 12px rgba(133, 79, 255, 0.2);
            border: none;
        }
        .chat-widget .chat-message.bot {
            background: var(--chat--color-background);
            border: 1px solid rgba(133, 79, 255, 0.2);
            color: var(--chat--color-font);
            align-self: flex-start;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        .chat-widget .chat-input {
            padding: 16px;
            background: var(--chat--color-background);
            border-top: 1px solid rgba(133, 79, 255, 0.1);
            display: flex;
            gap: 8px;
        }
        .chat-widget .chat-input textarea {
            flex: 1;
            padding: 12px;
            border: 1px solid rgba(133, 79, 255, 0.2);
            border-radius: 8px;
            background: var(--chat--color-background);
            color: var(--chat--color-font);
            resize: none;
            font-family: inherit;
            font-size: 14px;
        }
        .chat-widget .chat-input textarea::placeholder {
            color: var(--chat--color-font);
            opacity: 0.6;
        }
        .chat-widget .chat-input button {
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 0 20px;
            cursor: pointer;
            transition: transform 0.2s;
            font-family: inherit;
            font-weight: 500;
        }
        .chat-widget .chat-input button:hover {
            transform: scale(1.05);
        }
        .chat-widget .chat-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            border-radius: 30px;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(133, 79, 255, 0.3);
            z-index: 999;
            transition: transform 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .chat-widget .chat-toggle.position-left {
            right: auto;
            left: 20px;
        }
        .chat-widget .chat-toggle:hover {
            transform: scale(1.05);
        }
        .chat-widget .chat-toggle svg {
            width: 24px;
            height: 24px;
            fill: currentColor;
        }
        .chat-widget .chat-footer {
            padding: 8px;
            text-align: center;
            background: var(--chat--color-background);
            border-top: 1px solid rgba(133, 79, 255, 0.1);
        }
        .chat-widget .chat-footer a {
            color: var(--chat--color-primary);
            text-decoration: none;
            font-size: 12px;
            opacity: 0.8;
            transition: opacity 0.2s;
            font-family: inherit;
        }
        .chat-widget .chat-footer a:hover {
            opacity: 1;
        }
        /* Notification dot e animação de vibração */
        .chat-widget .notification-dot {
            position: absolute;
            top: -5px;
            right: -5px;
            width: 20px;
            height: 20px;
            background-color: #ff4444;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 12px;
            font-weight: bold;
            opacity: 0;
            transform: scale(0);
            transition: all 0.3s ease;
        }
        .chat-widget .notification-dot.show {
            opacity: 1;
            transform: scale(1);
        }
        @keyframes vibrate {
            0% { transform: translate(0); }
            20% { transform: translate(-2px, 2px); }
            40% { transform: translate(-2px, -2px); }
            60% { transform: translate(2px, 2px); }
            80% { transform: translate(2px, -2px); }
            100% { transform: translate(0); }
        }
        .chat-widget .chat-toggle.vibrating {
            animation: vibrate 0.1s linear infinite;
        }
        /* Indicador de digitação */
        .chat-message.typing-indicator {
            display: flex;
            align-items: center;
            justify-content: flex-start;
        }
        .typing-dots {
            display: inline-flex;
            gap: 4px;
            margin-top: 4px;
        }
        .typing-dots .dot {
            width: 8px;
            height: 8px;
            background-color: #ccc;
            border-radius: 50%;
            animation: typingIndicator 1s infinite;
            opacity: 0.4;
        }
        .typing-dots .dot:nth-child(2) {
            animation-delay: 0.2s;
        }
        .typing-dots .dot:nth-child(3) {
            animation-delay: 0.4s;
        }
        @keyframes typingIndicator {
            0% { transform: translateY(0); opacity: 0.4; }
            50% { transform: translateY(-3px); opacity: 1; }
            100% { transform: translateY(0); opacity: 0.4; }
        }
    `;
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://cdn.jsdelivr.net/npm/geist@1.0.0/dist/fonts/geist-sans/style.css';
    document.head.appendChild(fontLink);
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
    
    // 2. Configuração padrão e merge com window.ChatWidgetConfig (definido no HTML)
    const defaultConfig = {
        webhook: { url: '', route: '' },
        branding: {
            logo: '',
            name: '',
            welcomeText: '',
            responseTimeText: '',
            poweredBy: { text: 'Powered by ChatWidget', link: '#' }
        },
        style: {
            primaryColor: '',
            secondaryColor: '',
            position: 'right',
            backgroundColor: '#ffffff',
            fontColor: '#333333'
        },
        baserow: null
    };
    const config = window.ChatWidgetConfig
        ? {
            webhook: { ...defaultConfig.webhook, ...window.ChatWidgetConfig.webhook },
            branding: { ...defaultConfig.branding, ...window.ChatWidgetConfig.branding },
            style: { ...defaultConfig.style, ...window.ChatWidgetConfig.style },
            baserow: window.ChatWidgetConfig.baserow || null
        } : defaultConfig;
    if (window.ChatWidgetInitialized) return;
    window.ChatWidgetInitialized = true;
    
    // Variáveis globais
    let currentSessionId = '';
    let baserowRowId = null;
    
    // 3. Criação do container do widget e ajuste de variáveis CSS
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'chat-widget';
    widgetContainer.style.setProperty('--chat--color-primary', config.style.primaryColor || '#854fff');
    widgetContainer.style.setProperty('--chat--color-secondary', config.style.secondaryColor || '#6b3fd4');
    widgetContainer.style.setProperty('--chat--color-background', config.style.backgroundColor || '#ffffff');
    widgetContainer.style.setProperty('--chat--color-font', config.style.fontColor || '#333333');
    
    const chatContainer = document.createElement('div');
    chatContainer.className = `chat-container${config.style.position === 'left' ? ' position-left' : ''}`;
    
    // HTML da tela inicial e interface do chat
    const newConversationHTML = `
        <div class="brand-header">
            <img src="${config.branding.logo}" alt="${config.branding.name}">
            <span>${config.branding.name}</span>
            <button class="close-button">×</button>
        </div>
        <div class="new-conversation">
            <h2 class="welcome-text">${config.branding.welcomeText}</h2>
            <button class="new-chat-btn">
                <svg class="message-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/>
                </svg>
                Send us a message
            </button>
            <p class="response-text">${config.branding.responseTimeText}</p>
        </div>
    `;
    const chatInterfaceHTML = `
        <div class="chat-interface">
            <div class="brand-header">
                <img src="${config.branding.logo}" alt="${config.branding.name}">
                <span>${config.branding.name}</span>
                <button class="close-button">×</button>
            </div>
            <div class="chat-messages"></div>
            <div class="chat-input">
                <textarea placeholder="Type your message here..." rows="1"></textarea>
                <button type="submit">Send</button>
            </div>
            <div class="chat-footer">
                <a href="${config.branding.poweredBy.link}" target="_blank">${config.branding.poweredBy.text}</a>
            </div>
        </div>
    `;
    chatContainer.innerHTML = newConversationHTML + chatInterfaceHTML;
    
    // Botão flutuante (chat-toggle)
    const toggleButton = document.createElement('button');
    toggleButton.className = `chat-toggle${config.style.position === 'left' ? ' position-left' : ''}`;
    toggleButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.5 21.5l4.5-.838A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.476 0-2.886-.313-4.156-.878l-3.156.586.586-3.156A7.962 7.962 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/>
        </svg>
    `;
    // Cria o notification dot e anexa ao toggleButton
    const notificationDot = document.createElement('div');
    notificationDot.className = 'notification-dot';
    notificationDot.textContent = '!';
    toggleButton.appendChild(notificationDot);
    
    // Anexa os elementos ao documento
    widgetContainer.appendChild(chatContainer);
    widgetContainer.appendChild(toggleButton);
    document.body.appendChild(widgetContainer);
    
    // Referências da interface
    const newChatBtn = chatContainer.querySelector('.new-chat-btn');
    const chatInterface = chatContainer.querySelector('.chat-interface');
    const messagesContainer = chatContainer.querySelector('.chat-messages');
    const textarea = chatContainer.querySelector('textarea');
    const sendButton = chatContainer.querySelector('button[type="submit"]');
    
    // Função para exibir o indicador de digitação
    function showTypingIndicator() {
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'chat-message bot typing-indicator';
        typingIndicator.innerHTML = `
            <div class="typing-dots">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
            </div>
        `;
        messagesContainer.appendChild(typingIndicator);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return typingIndicator;
    }
    // Remove o indicador de digitação
    function hideTypingIndicator(indicator) {
        if (indicator && indicator.parentNode) {
            indicator.parentNode.removeChild(indicator);
        }
    }
    // Gera UUID
    function generateUUID() {
        return crypto.randomUUID ? crypto.randomUUID() :
            'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                const r = Math.random() * 16 | 0;
                const v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
    }
    // Função para buscar o output do Baserow
    async function fetchBaserowResponse() {
        if (!config.baserow || !config.baserow.apiUrl || !config.baserow.token || !baserowRowId) return null;
        const url = config.baserow.apiUrl.replace(/\/\\?user_field_names=true$/, `/${baserowRowId}/?user_field_names=true`);
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${config.baserow.token}`
                }
            });
            const data = await response.json();
            return data.output;
        } catch (e) {
            console.error('Erro ao buscar resposta do Baserow:', e);
            return null;
        }
    }
    // Polling para aguardar alteração no output, exibindo o indicador de digitação
    async function pollForOutputChange(previousOutput, timeout = 10000, interval = 1000) {
        const start = Date.now();
        const typingIndicator = showTypingIndicator();
        let finalOutput = null;
        try {
            while (Date.now() - start < timeout) {
                const newOutput = await fetchBaserowResponse();
                if (newOutput && newOutput !== previousOutput) {
                    finalOutput = newOutput;
                    break;
                }
                await new Promise(resolve => setTimeout(resolve, interval));
            }
        } finally {
            hideTypingIndicator(typingIndicator);
        }
        return finalOutput;
    }
    // handleChatEvent: cria (POST) ou atualiza (PATCH) a linha no Baserow
    async function handleChatEvent(action, chatInput) {
        if (!config.baserow || !config.baserow.apiUrl || !config.baserow.token) return;
        const token = config.baserow.token;
        const data = { sessionId: currentSessionId, action: action, chatInput: chatInput };
        if (action === 'startConversation') {
            try {
                const response = await fetch(config.baserow.apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${token}`
                    },
                    body: JSON.stringify(data)
                });
                const responseData = await response.json();
                baserowRowId = responseData.id;
                return responseData;
            } catch (e) {
                console.error('Erro ao criar a linha:', e);
                const errorMessageDiv = document.createElement('div');
                errorMessageDiv.className = 'chat-message bot';
                errorMessageDiv.textContent = "Desculpe, tivemos um problema ao iniciar a conversa. Tente novamente.";
                messagesContainer.appendChild(errorMessageDiv);
            }
        } else if (action === 'sendMessage') {
            if (!baserowRowId) {
                console.error('Nenhuma linha criada para atualizar. Execute startConversation primeiro.');
                const errorMessageDiv = document.createElement('div');
                errorMessageDiv.className = 'chat-message bot';
                errorMessageDiv.textContent = "Erro: Inicie a conversa antes de enviar mensagens.";
                messagesContainer.appendChild(errorMessageDiv);
                return;
            }
            const url = config.baserow.apiUrl.replace(/\/\\?user_field_names=true$/, `/${baserowRowId}/?user_field_names=true`);
            try {
                const response = await fetch(url, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${token}`
                    },
                    body: JSON.stringify(data)
                });
                return await response.json();
            } catch (e) {
                console.error('Erro ao atualizar a linha:', e);
                const errorMessageDiv = document.createElement('div');
                errorMessageDiv.className = 'chat-message bot';
                errorMessageDiv.textContent = "Desculpe, tivemos um problema ao enviar sua mensagem. Tente novamente.";
                messagesContainer.appendChild(errorMessageDiv);
            }
        }
    }
    // Inicia nova conversa
    async function startNewConversation() {
        try {
            currentSessionId = generateUUID();
            // Oculta a tela de boas-vindas
            const welcomeHeader = chatContainer.querySelector('.brand-header');
            const welcomeConversation = chatContainer.querySelector('.new-conversation');
            if (welcomeHeader) welcomeHeader.style.display = 'none';
            if (welcomeConversation) welcomeConversation.style.display = 'none';
            // Mostra a interface do chat
            chatInterface.classList.add('active');
            // Cria a linha no Baserow
            if (config.baserow) {
                await handleChatEvent('startConversation', '');
            }
            const previousOutput = await fetchBaserowResponse();
            const updatedOutput = await pollForOutputChange(previousOutput, 10000, 1000);
            const botMessageDiv = document.createElement('div');
            botMessageDiv.className = 'chat-message bot';
            botMessageDiv.textContent = updatedOutput || "Desculpe, não recebemos uma resposta. Tente novamente.";
            messagesContainer.appendChild(botMessageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (error) {
            console.error('Error starting conversation:', error);
            chatInterface.classList.add('active');
            const errorMessageDiv = document.createElement('div');
            errorMessageDiv.className = 'chat-message bot';
            errorMessageDiv.textContent = "Desculpe, tivemos um problema ao iniciar a conversa. Por favor, tente novamente mais tarde.";
            messagesContainer.appendChild(errorMessageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }
    // Envia mensagem
    async function sendMessage(message) {
        if (!currentSessionId) {
            currentSessionId = generateUUID();
        }
        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'chat-message user';
        userMessageDiv.textContent = message;
        messagesContainer.appendChild(userMessageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        const previousOutput = await fetchBaserowResponse();
        if (config.baserow) {
            await handleChatEvent('sendMessage', message);
        }
        const updatedOutput = await pollForOutputChange(previousOutput, 10000, 1000);
        const botMessageDiv = document.createElement('div');
        botMessageDiv.className = 'chat-message bot';
        botMessageDiv.textContent = updatedOutput || "Desculpe, não recebemos uma resposta. Tente novamente.";
        messagesContainer.appendChild(botMessageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    // Eventos do widget
    toggleButton.addEventListener('click', () => {
        chatContainer.classList.toggle('open');
        notificationDot.classList.remove('show');
        toggleButton.classList.remove('vibrating');
    });
    newChatBtn.addEventListener('click', startNewConversation);
    sendButton.addEventListener('click', () => {
        const message = textarea.value.trim();
        if (message) {
            sendMessage(message);
            textarea.value = '';
        }
    });
    textarea.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const message = textarea.value.trim();
            if (message) {
                sendMessage(message);
                textarea.value = '';
            }
        }
    });
    const closeButtons = chatContainer.querySelectorAll('.close-button');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            chatContainer.classList.remove('open');
        });
    });
    // Notificação: som, vibração e exibição do dot se o chat não estiver aberto
    const notificationSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    function triggerNotification() {
        if (!chatContainer.classList.contains('open')) {
            notificationSound.play().catch(err => console.log('Erro ao tocar som:', err));
            toggleButton.classList.add('vibrating');
            notificationDot.classList.add('show');
            setTimeout(() => {
                toggleButton.classList.remove('vibrating');
            }, 1000);
        }
    }
    setTimeout(triggerNotification, 25000);
})();
