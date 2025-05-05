const eventHandlers = {};

let socket = null;
let isConnected = false;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;
const reconnectInterval = 3000;
let connectPromise = null;
let isConnecting = false;
let pendingMessages = [];

const connect = () => {
    if (isConnected && socket) {
        return Promise.resolve();
    }

    if (isConnecting && connectPromise) {
        return connectPromise;
    }

    isConnecting = true;
    connectPromise = new Promise((resolve, reject) => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'localhost:8000';
            const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
            const wsUrl = `${wsProtocol}://${apiUrl.replace(/^https?:\/\//, '')}/ws/socketio/`;
            
            console.log('Connecting to notification server:', wsUrl);
            
            const newSocket = new WebSocket(wsUrl);
            
            newSocket.onopen = () => {
                console.log('Connected to notification server');
                socket = newSocket;
                isConnected = true;
                isConnecting = false;
                reconnectAttempts = 0;
                
                while (pendingMessages.length > 0) {
                    const { command, data } = pendingMessages.shift();
                    _sendMessage(command, data);
                }
                
                _sendMessage('get_unread_count');
                resolve();
            };
            
            newSocket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    const eventType = data.type;
                    
                    if (eventHandlers[eventType]) {
                        eventHandlers[eventType].forEach(handler => handler(data));
                    }
                } catch (error) {
                    console.error('Error processing WebSocket message:', error);
                }
            };
            
            newSocket.onclose = (event) => {
                console.log('Disconnected from notification server', event.code, event.reason);
                isConnected = false;
                isConnecting = false;
                socket = null;
                connectPromise = null;
                
                if (reconnectAttempts < maxReconnectAttempts) {
                    reconnectAttempts++;
                    setTimeout(() => {
                        console.log(`Reconnection attempt (${reconnectAttempts}/${maxReconnectAttempts})...`);
                        connect();
                    }, reconnectInterval);
                }
                
                reject(new Error('Connection closed'));
            };
            
            newSocket.onerror = (error) => {
                console.error('WebSocket connection error:', error);
                isConnecting = false;
                reject(error);
            };
        } catch (error) {
            console.error('Error creating WebSocket connection:', error);
            isConnecting = false;
            connectPromise = null;
            reject(error);
        }
    });

    return connectPromise;
};

const disconnect = () => {
    if (socket) {
        socket.close();
        isConnected = false;
        isConnecting = false;
        socket = null;
        connectPromise = null;
        pendingMessages = [];
    }
};

const on = (event, handler) => {
    if (!eventHandlers[event]) {
        eventHandlers[event] = [];
    }
    
    eventHandlers[event].push(handler);
    
    return () => {
        if (eventHandlers[event]) {
            eventHandlers[event] = eventHandlers[event].filter(h => h !== handler);
            
            if (eventHandlers[event].length === 0) {
                delete eventHandlers[event];
            }
        }
    };
};

const _sendMessage = (command, data = {}) => {
    if (socket && isConnected) {
        try {
            const message = {
                command,
                ...data
            };
            socket.send(JSON.stringify(message));
            return true;
        } catch (error) {
            console.error('Error sending WebSocket message:', error);
            return false;
        }
    }
    return false;
};

const emit = (command, data = {}) => {
    if (!isConnected || !socket) {
        pendingMessages.push({ command, data });
        
        if (!isConnecting) {
            console.log('Attempting to connect before sending message...');
            connect().catch(error => {
                console.error('Failed to connect before sending message:', error);
            });
        }
    } else {
        return _sendMessage(command, data);
    }
};

const triggerLocalEvent = (eventType, data) => {
    if (eventHandlers[eventType]) {
        eventHandlers[eventType].forEach(handler => handler(data));
    }
};

const getUnreadCount = () => {
    emit('get_unread_count');
};

const markAsRead = (notificationId) => {
    emit('mark_as_read', { notification_id: notificationId });
};

const markAllAsRead = async () => {
    emit('mark_all_as_read');
    
    triggerLocalEvent('all_notifications_read', { count: 0 });
    triggerLocalEvent('unread_count', { count: 0 });
    
    try {
        const { authAxios } = await import('../api/useAxios');
        await authAxios.post('/notifications/mark_all_as_read/');
        console.log('Successfully marked all notifications as read via REST API');
    } catch (error) {
        console.error('Error marking all notifications as read via REST API:', error);
    }
};

const notificationEvents = {
    connect,
    disconnect,
    on,
    emit,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    triggerLocalEvent
};

export default notificationEvents;
