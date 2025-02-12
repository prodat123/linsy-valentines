import React from "react";

const PopupModal = ({ isOpen, currentPoints, onClose, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <h2 className="text-xl font-bold">{title}</h2>
                <p className="mt-2">{message}</p>
                <p className="text-sm mt-2">You need <strong>{Math.max(5 - currentPoints, 0)}</strong> more point/s to see your letter.</p>
                <button 
                onClick={onClose} 
                className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600">
                Close
                </button>
            </div>
        </div>
    );
};

export default PopupModal;
