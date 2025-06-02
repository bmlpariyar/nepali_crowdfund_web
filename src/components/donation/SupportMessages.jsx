import React, { useState, useEffect } from 'react'
import { getSupportMessages } from '../../services/apiService';
import { formatDistanceToNowStrict } from 'date-fns';


const SupportMessages = ({ campaignId, refreshTrigger }) => {

    const [messages, setMessages] = useState([])

    const cId = campaignId

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



    return (
        <div>
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Messages of Support</h2>



                {messages.length > 0 && (
                    <div className="space-y-6">
                        {messages.map((msg) => (
                            <div key={msg.id} className="flex gap-4">
                                <div className="w-10 h-10 bg-indigo-100 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0">
                                    <img
                                        src={msg.user_avater}
                                        alt="User avatar"
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-gray-900">{msg.username}</span>
                                        <span className="text-sm text-gray-600">
                                            • NPR {msg.amount} • {formatDistanceToNowStrict(new Date(msg.created_at), { addSuffix: true })}
                                        </span>
                                    </div>
                                    <p className="text-gray-700">{msg.message}</p>
                                </div>
                            </div>

                        ))}

                    </div>
                )}


                <button className="mt-6 text-indigo-600 hover:text-indigo-800 font-medium text-sm">
                    See all messages →
                </button>
            </div>

        </div>
    )
}

export default SupportMessages