import React from 'react';
import Modal from '../ui/Modal';

const AlertModal = ({
    show,
    title = 'Are you sure?',
    message = 'Do you really want to proceed?',
    onConfirm,
    onCancel
}) => {
    return (
        <Modal show={show} onClose={onCancel} title={title}>
            <div className="space-y-4 text-gray-700 text-lg">
                <p>{message}</p>
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onCancel}
                        className="px-5 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
                    >
                        No
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-5 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white transition"
                    >
                        Yes
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default AlertModal;
