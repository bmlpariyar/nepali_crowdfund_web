import React from 'react'
import Modal from '../ui/Modal'

const ImageDisplayModal = ({ isOpen, onClose, imageUrl }) => {
    return (
        <Modal show={isOpen} onClose={onClose} noScroll={true}>
            <div key={imageUrl} className="w-full h-full">
                <img src={imageUrl} alt="Image" className="w-full h-full object-contain rounded-lg" />
            </div>
        </Modal>
    )
}

export default ImageDisplayModal