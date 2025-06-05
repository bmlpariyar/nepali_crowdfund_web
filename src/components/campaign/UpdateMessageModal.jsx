import React, { useState, useEffect, useRef } from 'react';
import { postUpdateMessages } from '../../services/apiService';
import { toast } from 'react-toastify';
import Modal from '../ui/Modal';

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
    const [preview, setPreview] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        if (mediaImage) {
            const objectUrl = URL.createObjectURL(mediaImage);
            setPreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl); // Cleanup on unmount or file change
        } else {
            setPreview(null);
        }
    }, [mediaImage]);

    useEffect(() => {
        if (error) toast.error(error);
    }, [error]);

    useEffect(() => {
        if (success) toast.success(success);
    }, [success]);

    if (!isOpen) return null;

    const handleImageChange = (file) => {
        if (file && file.type.startsWith('image/')) {
            setMediaImage(file);
        } else {
            toast.error('Please select a valid image file (JPEG or PNG).');
        }
    };

    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        handleImageChange(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        handleImageChange(file);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError(null);
        setSuccess(null);

        if (!user) {
            toast.error("Please log in to submit an update.");
            return;
        }

        if (!title.trim() || !message.trim()) {
            toast.error("Title and message cannot be empty.");
            return;
        }

        const data = {
            title: title.trim(),
            message: message.trim(),
            media_image: mediaImage || null,
        };

        try {
            await postUpdateMessages(campaignId, data);
            setSuccess("Update message submitted successfully!");
            setTitle('');
            setMessage('');
            setMediaImage(null);
            setPreview(null);
            onClose();
            if (onUpdateSuccess) onUpdateSuccess();
        } catch (err) {
            console.error("Error submitting update message:", err);
            setError(err.response?.data?.error || "Failed to submit update message.");
        }
    };

    return (

        <Modal
            show={isOpen}
            onClose={onClose}
            title="Enter progress update message:"
        >


            <div>

                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
                    placeholder="Title"
                />

                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Write your update message here..."
                    rows="4"
                />

                <div className="mt-6">
                    <label className="block mb-2 font-medium text-gray-700">
                        Attach Image (Optional)
                    </label>

                    <div
                        className={`border-2 border-dashed h-64 rounded-xl p-10 text-center cursor-pointer transition-all flex flex-col justify-center items-center ${isDragging ? "border-green-500 bg-green-50" : "border-gray-300 bg-gray-50"
                            }`}
                        onClick={() => fileInputRef.current.click()}
                        onDragOver={(e) => {
                            e.preventDefault();
                            setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                    >
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleFileInputChange}
                            className="hidden"
                        />
                        <p className="text-gray-600">
                            Drag & drop your image here or <span className="text-green-600 font-semibold">click to browse</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-2">Accepted formats: JPEG, PNG</p>
                    </div>

                    {preview && (
                        <img
                            src={preview}
                            alt="Preview"
                            className="mt-6 w-full h-64 object-cover rounded-lg"
                        />
                    )}
                </div>

                <div className="flex justify-end mt-6">
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-150"
                    >
                        Submit Update
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default UpdateMessageModal;
