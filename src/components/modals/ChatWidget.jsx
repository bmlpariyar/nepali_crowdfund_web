import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, Clock } from 'lucide-react';
import { fetchChatMessages, postChatMessage, markMessagesAsRead } from '../../services/apiService';
import { formatDistanceToNowStrict } from 'date-fns';

const ChatWidget = ({
    campaignId,
    currentUser,
    isCreator = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [totalUnreadCount, setTotalUnreadCount] = useState(0);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Load chat messages and organize by conversations
    const loadMessages = async () => {
        if (!campaignId) return;

        setLoading(true);
        try {
            const response = await fetchChatMessages(campaignId);
            const allMessages = response.data.data;
            setMessages(allMessages);

            if (isCreator) {
                // Group messages by conversation for creators
                const conversationMap = new Map();
                const currentUserType = 'creator';

                allMessages.forEach(msg => {
                    const convId = msg.conversation_id;
                    if (!conversationMap.has(convId)) {
                        conversationMap.set(convId, {
                            id: convId,
                            participantName: msg.sender_type === 'donor' ? msg.sender_name :
                                allMessages.find(m => m.conversation_id === convId && m.sender_type === 'donor')?.sender_name || 'Unknown',
                            lastMessage: msg,
                            unreadCount: 0,
                            messages: []
                        });
                    }

                    const conversation = conversationMap.get(convId);
                    conversation.messages.push(msg);

                    // Update last message if this one is newer
                    if (new Date(msg.created_at) > new Date(conversation.lastMessage.created_at)) {
                        conversation.lastMessage = msg;
                    }

                    // Count unread messages from donors
                    if (!msg.read && msg.sender_type !== currentUserType) {
                        conversation.unreadCount++;
                    }
                });

                // Convert to array and sort by last message time
                const conversationArray = Array.from(conversationMap.values())
                    .sort((a, b) => new Date(b.lastMessage.created_at) - new Date(a.lastMessage.created_at));

                setConversations(conversationArray);

                // Calculate total unread count
                const totalUnread = conversationArray.reduce((sum, conv) => sum + conv.unreadCount, 0);
                setTotalUnreadCount(totalUnread);

                // Auto-select first conversation if none selected
                if (!selectedConversation && conversationArray.length > 0) {
                    setSelectedConversation(conversationArray[0]);
                }
            } else {
                // For donors, count unread messages from creator
                const unread = allMessages.filter(msg =>
                    !msg.read && msg.sender_type === 'creator'
                ).length;
                setTotalUnreadCount(unread);
            }

        } catch (error) {
            console.error('Error loading messages:', error);
        } finally {
            setLoading(false);
        }
    };

    // Get messages for selected conversation
    const getConversationMessages = () => {
        if (!isCreator) {
            return messages; // Donors see all messages
        }

        if (!selectedConversation) {
            return [];
        }

        return messages.filter(msg => msg.conversation_id === selectedConversation.id);
    };

    // Send new message
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        if (isCreator && !selectedConversation) {
            console.error('Creator must select a conversation');
            return;
        }

        setSending(true);
        try {
            const messageData = { message: newMessage.trim() };
            const recipientId = isCreator ? selectedConversation.messages[0].doner_id : null;
            debugger
            const response = await postChatMessage(
                campaignId,
                messageData,
                recipientId
            );

            setMessages(prev => [...prev, response.data.data]);
            setNewMessage('');

            if (isCreator && selectedConversation) {
                setSelectedConversation(prev => ({
                    ...prev,
                    lastMessage: response.data.data
                }));
            }

            setTimeout(() => inputRef.current?.focus(), 100);
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setSending(false);
        }
    };


    // Mark messages as read when chat opens or conversation changes
    const markConversationAsRead = async (conversationId = null) => {
        try {
            await markMessagesAsRead(campaignId, conversationId);

            if (isCreator && selectedConversation) {
                // Update conversation unread count
                setConversations(prev => prev.map(conv =>
                    conv.id === selectedConversation.id
                        ? { ...conv, unreadCount: 0 }
                        : conv
                ));

                // Update messages as read
                setMessages(prev => prev.map(msg =>
                    msg.conversation_id === selectedConversation.id
                        ? { ...msg, read: true, read_at: new Date().toISOString() }
                        : msg
                ));
            } else {
                // For donors, mark all messages as read
                setMessages(prev => prev.map(msg => ({
                    ...msg,
                    read: true,
                    read_at: new Date().toISOString()
                })));
            }

            // Recalculate total unread count
            if (isCreator) {
                const newTotalUnread = conversations.reduce((sum, conv) =>
                    conv.id === selectedConversation?.id ? sum : sum + conv.unreadCount, 0
                );
                setTotalUnreadCount(newTotalUnread);
            } else {
                setTotalUnreadCount(0);
            }

        } catch (error) {
            console.error('Error marking messages as read:', error);
        }
    };

    // Handle chat open
    const handleChatOpen = async () => {
        setIsOpen(true);
        if (totalUnreadCount > 0) {
            await markConversationAsRead();
        }
    };

    // Handle conversation selection
    const handleConversationSelect = (conversation) => {
        setSelectedConversation(conversation);
        if (conversation.unreadCount > 0) {
            markConversationAsRead(conversation.id);
        }
    };

    // Load messages on component mount
    useEffect(() => {
        loadMessages();
    }, [campaignId]);

    // Scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages, selectedConversation]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current.focus(), 100);
        }
    }, [isOpen]);

    // Get current conversation messages
    const currentMessages = getConversationMessages();

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

                    {/* Conversation Bubbles (Creator Only) */}
                    {isCreator && conversations.length > 0 && (
                        <div className="p-3 border-b border-gray-200 bg-gray-50">
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {conversations.map((conversation) => (
                                    <button
                                        key={conversation.id}
                                        onClick={() => handleConversationSelect(conversation)}
                                        className={`relative flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-full text-sm transition-colors ${selectedConversation?.id === conversation.id
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        <User size={16} />
                                        <span className="max-w-20 truncate">
                                            {conversation.participantName}
                                        </span>

                                        {/* Unread Badge */}
                                        {conversation.unreadCount > 0 && (
                                            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                                                {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {loading ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-gray-500">Loading messages...</div>
                            </div>
                        ) : currentMessages.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-center">
                                <div className="text-gray-500">
                                    <MessageCircle size={48} className="mx-auto mb-2 text-gray-300" />
                                    {isCreator ? (
                                        conversations.length === 0 ? (
                                            <>
                                                <p>No conversations yet.</p>
                                                <p className="text-sm">Supporters will appear here when they message you.</p>
                                            </>
                                        ) : (
                                            <>
                                                <p>No messages in this conversation.</p>
                                                <p className="text-sm">Start chatting with this supporter!</p>
                                            </>
                                        )
                                    ) : (
                                        <>
                                            <p>No messages yet.</p>
                                            <p className="text-sm">Start a conversation!</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        ) : (
                            currentMessages.map((message) => {
                                const currentUserType = isCreator ? 'creator' : 'donor';
                                const isCurrentUser = message.sender_type === currentUserType;

                                return (
                                    <div
                                        key={message.id}
                                        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
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
                                                <span>
                                                    {formatDistanceToNowStrict(new Date(message.created_at), { addSuffix: true })}
                                                </span>
                                                {isCurrentUser && message.read && (
                                                    <span className="ml-1">✓</span>
                                                )}
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
                        {isCreator && !selectedConversation ? (
                            <div className="text-center text-gray-500 text-sm py-2">
                                Select a conversation to start messaging
                            </div>
                        ) : (
                            <form onSubmit={handleSendMessage} className="flex gap-2">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder={
                                        isCreator && selectedConversation
                                            ? `Message ${selectedConversation.participantName}...`
                                            : "Type your message..."
                                    }
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    disabled={sending}
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim() || sending}
                                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                >
                                    {sending ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <Send size={16} />
                                    )}
                                </button>
                            </form>
                        )}
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
                {totalUnreadCount > 0 && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse">
                        {totalUnreadCount > 9 ? '9+' : totalUnreadCount}
                    </div>
                )}
            </button>
        </div>
    );
};

export default ChatWidget;