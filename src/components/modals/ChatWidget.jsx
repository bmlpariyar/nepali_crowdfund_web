import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, Clock } from 'lucide-react';
import { fetchChatMessages, postChatMessage, markMessagesAsRead } from '../../services/apiService';
import { formatDistanceToNowStrict } from 'date-fns';

const ChatWidget = ({ campaignId, currentUser, isCreator = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Load chat messages
    const loadMessages = async () => {
        if (!campaignId) return;

        setLoading(true);
        try {
            const response = await fetchChatMessages(campaignId);
            setMessages(response.data.chat_messages);
            // Count unread messages
            const currentUserType = isCreator ? 'creator' : 'donor';
            const unread = response.data.chat_messages.filter(msg =>
                !msg.read && msg.sender_type !== currentUserType
            ).length;
            setUnreadCount(unread);

        } catch (error) {
            console.error('Error loading messages:', error);
        } finally {
            setLoading(false);
        }
    };


    // Send new message
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        setSending(true);
        try {
            const response = await postChatMessage(campaignId, { message: newMessage.trim() });

            // Add new message to the list
            setMessages(prev => [...prev, response.data.data]);
            setNewMessage('');

            // Focus back on input
            setTimeout(() => inputRef.current?.focus(), 100);

        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setSending(false);
        }
    };

    // Mark messages as read when chat opens
    const handleChatOpen = async () => {
        setIsOpen(true);
        if (unreadCount > 0) {
            try {
                await markMessagesAsRead(campaignId);
                setUnreadCount(0);
                setMessages(prev => prev.map(msg => ({ ...msg, read: true })));
            } catch (error) {
                console.error('Error marking messages as read:', error);
            }
        }
    };

    // Load messages on component mount
    useEffect(() => {
        loadMessages();
    }, [campaignId]);

    // Scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current.focus(), 100);
        }
    }, [isOpen]);

    // Format timestamp

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-600 text-white rounded-t-lg">
                        <div className="flex items-center gap-2">
                            <MessageCircle size={20} />
                            <div>
                                <h3 className="font-medium">Campaign Chat</h3>
                                <p className="text-xs text-blue-100">
                                    {isCreator ? 'Chat with supporters' : 'Chat with creator'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-blue-100 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {loading ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-gray-500">Loading messages...</div>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-center">
                                <div className="text-gray-500">
                                    <MessageCircle size={48} className="mx-auto mb-2 text-gray-300" />
                                    <p>No messages yet.</p>
                                    <p className="text-sm">Start a conversation!</p>
                                </div>
                            </div>
                        ) : (
                            messages.map((message) => {
                                const currentUserType = isCreator ? 'creator' : 'donor';
                                const isCurrentUser = message.sender_type === currentUserType;

                                return (
                                    <div
                                        key={message.id}
                                        className={`flex ${isCurrentUser ? 'justify-start' : 'justify-end'}`}
                                    >
                                        <div
                                            className={`max-w-[70%] rounded-lg px-3 py-2 ${isCurrentUser
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-800'
                                                }`}
                                        >
                                            <p className="text-sm">{message.message}</p>
                                            <div className={`flex items-center gap-1 mt-1 text-xs ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'
                                                }`}>
                                                <Clock size={12} />
                                                <span>{formatDistanceToNowStrict(new Date(message.created_at), { addSuffix: true })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="border-t border-gray-200 p-4">
                        <div className="flex gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(e)}
                                placeholder="Type your message..."
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                disabled={sending}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!newMessage.trim() || sending}
                                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            >
                                {sending ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <Send size={16} />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Button */}
            <button
                onClick={handleChatOpen}
                className="relative bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
                <MessageCircle size={24} />

                {/* Unread Badge */}
                {unreadCount > 0 && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </div>
                )}
            </button>
        </div>
    );
};

export default ChatWidget;