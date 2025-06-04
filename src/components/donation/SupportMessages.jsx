import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { getSupportMessages } from '../../services/apiService';
import { formatDistanceToNowStrict } from 'date-fns';

const SupportMessages = ({ campaignId, refreshTrigger }) => {
    const [messages, setMessages] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const cId = campaignId;

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await getSupportMessages(cId); // returns Axios response
                const data = response.data;
                if (response.status !== 200) {
                    throw new Error(data.error || data.message || "Failed to fetch support messages.");
                }
                setMessages(data.support_messages || []);
            } catch (error) {
                console.error("Error fetching support messages:", error.response?.data?.error || error.message);
            }
        };

        if (cId) {
            fetchMessages();
        }
    }, [cId, refreshTrigger]);

    const handleShowAllMessages = () => {
        setShowModal(true);
    };

    // Render individual message component
    const renderMessage = (msg) => (
        <div key={msg.id} className="flex gap-4">
            <div className="w-10 h-10 bg-indigo-100 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0">
                {msg.user_avater ? (
                    <img
                        src={msg.user_avater}
                        alt="User avatar"
                        className="w-full h-full object-cover rounded-full"
                    />
                ) : (
                    <span className="text-sm font-medium text-indigo-700">
                        {msg.username?.[0] || 'U'}
                    </span>
                )}
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">{msg.username}</span>
                    <span className="text-sm text-gray-600">
                        • NPR {msg.amount} • {formatDistanceToNowStrict(new Date(msg.created_at), { addSuffix: true })}
                    </span>
                </div>
                <p className="text-gray-700">{msg.message}</p>
            </div>
        </div>
    );

    // Messages to show initially (first 10)
    const initialMessages = messages.slice(0, 5);
    const hasMoreMessages = messages.length > 10;

    return (
        <div>
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Messages of Support ({messages.length})</h2>

                {messages.length > 0 ? (
                    <>
                        <div className="space-y-6">
                            {initialMessages.map(renderMessage)}
                        </div>

                        {hasMoreMessages && (
                            <button
                                onClick={handleShowAllMessages}
                                className="mt-6 text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors"
                            >
                                See all {messages.length} messages →
                            </button>
                        )}
                    </>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No support messages yet.</p>
                        <p className="text-sm text-gray-400 mt-1">Be the first to leave a message of support!</p>
                    </div>
                )}
            </div>

            {/* Modal for all messages */}
            {showModal && (
                <Modal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    title={`Messages of Support (${messages.length})`}
                >
                    <div className="space-y-6">
                        {messages.map(renderMessage)}
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default SupportMessages;