import React, { useState, useEffect } from 'react'
import { getCampaignUpdateMessages } from '../services/apiService'
import { formatDistanceToNowStrict } from 'date-fns';
import { update } from 'lodash';


const CampaignStatusUpdate = ({ campaignId, retriggerKey }) => {
    const [updateMessages, setUpdateMessages] = useState([])

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await getCampaignUpdateMessages(campaignId); // returns Axios response
                const data = response.data;

                if (response.status !== 200) {
                    throw new Error(data.error || data.message || "Failed to fetch support messages.");
                }
                setUpdateMessages(data || []);
            } catch (error) {
                console.error("Error fetching support messages:", error.response?.data?.error || error.message);
            }
        };
        if (campaignId) {
            fetchMessages();
        }
    }, [campaignId, retriggerKey]);

    if (updateMessages.length === 0) return null;

    return (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Updates</h2>

            <div className="space-y-6">
                {updateMessages.length > 0 ? (
                    updateMessages.map((msg) => (
                        <div key={msg.id} className="border-l-4 border-indigo-500 pl-4 mb-6">
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">

                                <span>{formatDistanceToNowStrict(new Date(msg.created_at), { addSuffix: true })}</span>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">{msg.title}</h3>
                            <p className="text-gray-700">
                                {msg.message}
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center">No updates yet.</p>
                )}


            </div>
        </div>
    )
}

export default CampaignStatusUpdate