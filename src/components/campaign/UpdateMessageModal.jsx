import React, { useState, useEffect } from 'react'
import { postUpdateMessages } from '../../services/apiService';

const UpdateMessageModal = ({
    isOpen,
    onClose,
    user,
    campaignId,
    onUpdateSuccess
}) => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [mediaImage, setMediaImage] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    if (!isOpen) return null;
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Clear any previous messages
        setError(null);
        setSuccess(null);

        // Basic validation
        if (!user) {
            setError("Please log in to submit an update.");
            return;
        }

        if (!message.trim()) {
            setError("Update message cannot be empty.");
            return;
        }

        // Prepare form data
        const data = {
            title: title.trim(),
            message: message.trim(),
            media_image: mediaImage || null,
        };

        try {
            await postUpdateMessages(campaignId, data);
            setSuccess("Update message submitted successfully!");
            setMessage('');
            setMediaImage(null);
            setError(null);
            setSuccess(null);
            onClose();
            if (onUpdateSuccess) {
                onUpdateSuccess();
            }

        } catch (err) {
            console.error("Error submitting update message:", err);
            setError(err.response?.data?.error || "Failed to submit update message.");
        }
    };

    return (
        <div className='fixed inset-0 bg-gray-400/25 backdrop-blur-sm flex items-center justify-center z-50'>
            <div className="bg-white w-full max-w-3xl p-6 rounded-2xl relative shadow-lg">
                <button
                    onClick={onClose}
                    className="absolute top-3 cursor-pointer right-3 text-gray-500 hover:text-gray-700 text-lg font-bold"
                >
                    &times;
                </button>
                <div>
                    <h2 className="text-xl font-semibold mb-4 ">Enter progress update message:</h2>
                    <input
                        type="text"
                        value={title}
                        required
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
                        placeholder="Title "
                    />
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Write your update message here..."
                        rows="4"
                    ></textarea>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Attach Media (optional):
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setMediaImage(e.target.files[0])}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                    </div>
                    {error && (
                        <div className="mt-4 text-red-600">
                            <p>{error}</p>
                        </div>
                    )}
                    {success && (
                        <div className="mt-4 text-green-600">
                            <p>{success}</p>
                        </div>
                    )}
                    <div className="flex justify-end mt-4">
                        <button
                            onClick={handleSubmit}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-150"
                        >
                            Submit Update
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UpdateMessageModal