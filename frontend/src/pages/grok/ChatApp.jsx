import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, MessageCircle, Loader2, XCircle, Sparkles, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authAxios } from '../../api/useAxios';
import Markdown from 'react-markdown';

const ChatApp = () => {
    const [conversations, setConversations] = useState([]);
    const [activeConversationId, setActiveConversationId] = useState(null);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const startingQuestions = [
        "What can you do?",
        "Tell me a joke.",
        "How does AI work?",
        "Explain quantum physics.",
        "Write a short poem.",
        "Summarize the plot of a movie.",
    ];

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const response = await authAxios.get('http://127.0.0.1:8000/grok/conversations/');
                if (response.status !== 200) {
                    throw new Error(`Failed to fetch conversations: ${response.status}`);
                }
                const data = response.data;
                setConversations(data);
                // Set active conversation to the most recent one if it exists
                if (data.length > 0) {
                    setActiveConversationId(data[0].id);
                }
            } catch (error) {
                console.error('Error fetching conversations:', error);
            }
        };
        fetchConversations();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeConversationId, conversations]);

    useEffect(() => {
        const textarea = inputRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [input]);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [activeConversationId]);

    const createNewConversation = async () => {
        try {
            const response = await authAxios.post("http://127.0.0.1:8000/grok/conversations/", {
                title: `Conversation ${new Date().toLocaleString()}`
            });

            if (response.status !== 201) {
                throw new Error(`Failed to create conversation: ${response.status}`);
            }

            const newConversation = response.data;
            setConversations(prev => [newConversation, ...prev]);
            setActiveConversationId(newConversation.id);
        } catch (error) {
            console.error('Error creating new conversation:', error);
            alert(`Failed to create conversation: ${error.message}`);
        }
    };

    const sendMessage = useCallback(async (message = input) => {
        if (!message.trim() || !activeConversationId) return;

        const tempMessage = {
            id: `temp-${Date.now()}`,
            user_message: message,
            bot_response: '',
            timestamp: new Date().toISOString(),
        };

        setConversations(prevConversations =>
            prevConversations.map(conv =>
                conv.id === activeConversationId
                    ? { ...conv, messages: [...(conv.messages || []), tempMessage] }
                    : conv
            )
        );

        setInput('');
        setIsLoading(true);

        try {
            const response = await authAxios.post(`http://127.0.0.1:8000/grok/conversations/${activeConversationId}/messages/`, {
                user_message: message
            });

            if (response.status !== 201) {
                throw new Error(`Failed to send message: ${response.status}`);
            }

            const data = response.data;

            setConversations(prevConversations =>
                prevConversations.map(conv => {
                    if (conv.id === activeConversationId) {
                        const updatedMessages = conv.messages
                            .filter(m => m.id !== tempMessage.id)
                            .concat(data);
                        return { ...conv, messages: updatedMessages };
                    }
                    return conv;
                })
            );
        } catch (error) {
            console.error('Error sending message:', error);
            setConversations(prevConversations =>
                prevConversations.map(conv =>
                    conv.id === activeConversationId
                        ? { ...conv, messages: conv.messages.filter(m => m.id !== tempMessage.id) }
                        : conv
                )
            );
            alert(`Failed to send message: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    }, [input, activeConversationId]);

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const deleteConversation = async (conversationId) => {
        try {
            const response = await authAxios.delete(`http://127.0.0.1:8000/grok/conversations/${conversationId}/`);
            if (response.status !== 204) {
                throw new Error(`Failed to delete conversation: ${response.status}`);
            }

            setConversations(prev => prev.filter(conv => conv.id !== conversationId));

            if (activeConversationId === conversationId) {
                const remainingConversations = conversations.filter(conv => conv.id !== conversationId);
                setActiveConversationId(remainingConversations.length > 0 ? remainingConversations[0].id : null);
            }
        } catch (error) {
            console.error('Error deleting conversation:', error);
            alert(`Failed to delete conversation: ${error.message}`);
        }
    };

    const activeConversation = conversations.find(conv => conv.id === activeConversationId) || {};
    const activeMessages = activeConversation.messages || [];

    const markdownComponents = {
        p: ({ node, ...props }) => <p className="leading-relaxed" {...props} />,
        h1: ({ node, ...props }) => <h1 className="text-2xl font-bold text-white" {...props} />,
        h2: ({ node, ...props }) => <h2 className="text-xl font-semibold text-white" {...props} />,
        h3: ({ node, ...props }) => <h3 className="text-lg font-medium text-white" {...props} />,
        a: ({ node, ...props }) => <a className="text-blue-400 hover:underline" {...props} />,
        ul: ({ node, ...props }) => <ul className="list-disc list-inside" {...props} />,
        ol: ({ node, ...props }) => <ol className="list-decimal list-inside" {...props} />,
        blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-gray-500 pl-4 italic" {...props} />,
        code: ({ node, ...props }) => <code className="bg-gray-800 text-white rounded-md px-2 py-1 font-mono text-sm" {...props} />,
        pre: ({ node, ...props }) => <pre className="bg-gray-800 text-white rounded-md p-4 overflow-x-auto" {...props} />,
    };

    return (
        <div className="flex flex-col md:flex-row h-screen bg-[#000000] text-[#e2e8f0]">
            {/* Sidebar for conversations */}
            <aside className="w-full md:w-80 border-r border-[#2d3748] bg-[#0a0d14] flex flex-col transition-all duration-300 ease-in-out">
                <div className="p-4 border-b border-[#2d3748]">
                    <Button
                        className="w-full bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                        onClick={createNewConversation}
                    >
                        <Plus size={16} />
                        New Conversation
                    </Button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <AnimatePresence>
                        {conversations.length === 0 ? (
                            <div className="p-4 text-center text-gray-400">
                                No conversations yet
                            </div>
                        ) : (
                            conversations.map((conversation) => (
                                <motion.div
                                    key={conversation.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div
                                        className={cn(
                                            "flex justify-between items-center p-3 cursor-pointer hover:bg-[#1a202c] transition-colors duration-200",
                                            activeConversationId === conversation.id && "bg-[#1a202c] border-l-2 border-[#1d9bf0]"
                                        )}
                                        onClick={() => setActiveConversationId(conversation.id)}
                                    >
                                        <div className="flex items-center gap-2 flex-1 overflow-hidden">
                                            <MessageCircle size={16} className={cn(
                                                "flex-shrink-0",
                                                activeConversationId === conversation.id ? "text-[#1d9bf0]" : "text-gray-400"
                                            )} />
                                            <span className="truncate text-sm">
                                                {conversation.title || `Conversation ${new Date(conversation.created_at).toLocaleDateString()}`}
                                            </span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-transparent"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteConversation(conversation.id);
                                            }}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </aside>

            {/* Main chat area */}
            <main className="flex-1 flex flex-col w-full">
                <div className="flex items-center justify-between border-b border-[#2d3748] p-4 bg-[#0a0d14] shadow-md">
                    <div className='flex items-center gap-3'>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#1d9bf0] to-[#185a8c] flex items-center justify-center">
                            <MessageCircle className="h-5 w-5 text-white" />
                        </div>
                        <h1 className="text-xl font-semibold text-white truncate">
                            {activeConversation.title || "Chat with Gemini"}
                        </h1>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-6 scrollbar-thin scrollbar-thumb-[#2d3748] scrollbar-track-transparent">
                    <div className="w-full px-4 sm:px-6 md:px-8 max-w-3xl mx-auto">
                        <AnimatePresence>
                            {(!activeConversationId || activeMessages.length === 0) && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col items-center justify-center h-full text-center text-gray-400 py-20"
                                >
                                    <div className="p-6 rounded-full bg-[#111827] mb-6">
                                        <MessageCircle className="h-12 w-12 text-[#1d9bf0]" />
                                    </div>
                                    <h2 className="text-2xl font-semibold mb-3">
                                        {activeConversationId ? "Start a conversation" : "Create a new conversation"}
                                    </h2>
                                    <p className="max-w-md text-[#9ca3af]">
                                        {activeConversationId
                                            ? "Ask me anything using the chat below or try one of the suggested prompts."
                                            : "Click the 'New Conversation' button to get started."}
                                    </p>
                                </motion.div>
                            )}

                            {activeMessages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-6 mb-8"
                                >
                                    {/* User Message */}
                                    <div className="flex flex-col items-end">
                                        <div className="bg-[#1d3e6f] text-white rounded-2xl px-5 py-3 max-w-[85%] md:max-w-[75%] whitespace-pre-wrap break-words shadow-md">
                                            <Markdown components={markdownComponents}>
                                                {message.user_message}
                                            </Markdown>
                                        </div>
                                        <span className="text-xs text-[#6b7280] mt-2 px-2">
                                            {new Date(message.timestamp).toLocaleTimeString()}
                                        </span>
                                    </div>

                                    {/* Bot Response - only show if it exists */}
                                    {message.bot_response && (
                                        <div className="flex flex-col items-start">
                                            <div className="bg-[#1a202c] text-white rounded-2xl px-5 py-3 max-w-[85%] md:max-w-[75%] whitespace-pre-wrap break-words shadow-md border border-[#2d3748]">
                                                <div className="flex items-center mb-2">
                                                    <div className="w-6 h-6 rounded-full bg-[#1d9bf0] flex items-center justify-center mr-2">
                                                        <Sparkles className="h-3 w-3 text-white" />
                                                    </div>
                                                    <span className="text-sm font-medium text-[#1d9bf0]">Gemini</span>
                                                </div>
                                                <div className="prose prose-invert max-w-none">
                                                    <Markdown components={markdownComponents}>
                                                        {message.bot_response}
                                                    </Markdown>
                                                </div>
                                            </div>
                                            <span className="text-xs text-[#6b7280] mt-2 px-2">
                                                {new Date(message.timestamp).toLocaleTimeString()}
                                            </span>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {isLoading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.2 }}
                                className="flex items-center gap-3 text-[#1d9bf0] mt-4 ml-2"
                            >
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-[#1d9bf0] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-[#1d9bf0] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    <div className="w-2 h-2 bg-[#1d9bf0] rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
                                </div>
                                <p className="text-sm font-medium">Thinking...</p>
                            </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {activeConversationId && (
                    <>
                        <div className="px-4 pt-0 pb-2">
                            <div className="w-full max-w-3xl mx-auto">
                                <Card className="bg-gradient-to-r from-[#0f172a] to-[#1a202c] border-[#3b4a63] border shadow-lg rounded-xl overflow-hidden">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-[#e2e8f0] text-sm flex items-center gap-2">
                                            <div className="w-5 h-5 rounded-full bg-[#1d9bf0] flex items-center justify-center">
                                                <Sparkles className="h-3 w-3 text-white" />
                                            </div>
                                            Try asking me...
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex flex-wrap gap-2">
                                        {startingQuestions.map((question) => (
                                            <Button
                                                key={question}
                                                variant="outline"
                                                size="sm"
                                                onClick={() => sendMessage(question)}
                                                className="bg-[#111827]/50 hover:bg-[#1d9bf0]/20 text-[#e2e8f0] border-[#3b4a63] rounded-full transition-all duration-200 text-xs hover:border-[#1d9bf0] hover:text-[#1d9bf0]"
                                            >
                                                {question}
                                            </Button>
                                        ))}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        <div className="border-t border-[#2d3748] p-4 bg-[#0a0d14]">
                            <div className="w-full max-w-3xl mx-auto relative">
                                <div className="relative flex items-end">
                                    <div className="relative flex-1">
                                        <Textarea
                                            ref={inputRef}
                                            value={input}
                                            onChange={handleInputChange}
                                            onKeyDown={handleKeyDown}
                                            placeholder="Type your message..."
                                            className="flex-1 bg-[#1a202c] text-[#e2e8f0] border border-[#4a5568] rounded-2xl px-5 py-4 resize-none focus:outline-none focus:ring-2 focus:ring-[#1d9bf0] focus:border-transparent min-h-[3rem] max-h-[10rem] placeholder:text-[#6b7280] shadow-lg w-full pr-16"
                                            rows={1}
                                        />
                                        <Button
                                            onClick={() => sendMessage()}
                                            disabled={isLoading || !input.trim() || !activeConversationId}
                                            className="absolute right-2 bottom-2 bg-[#1d9bf0] text-white rounded-xl w-12 h-12 hover:bg-[#1a8cd8] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md"
                                            aria-label="Send message"
                                        >
                                            {isLoading ? (
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                            ) : (
                                                <Send className="h-5 w-5" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default ChatApp;