import React, { useState, useEffect } from 'react';
import clsx from 'clsx'; // Optional: for conditional classNames, or use ternaries manually

const Modal = ({ show, onClose, title, children, tabs, initialTab }) => {
    const [activeTab, setActiveTab] = useState(initialTab || tabs?.[0]?.key || 'default');

    useEffect(() => {
        if (initialTab) {
            setActiveTab(initialTab);
        }
    }, [initialTab]);
    if (!show) return null;

    const renderTabs = () => (
        <div className="flex gap-2 mb-4 pb-2">
            {tabs.map((tab, index) => (
                <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={clsx(
                        'px-7 py-2 rounded-full text-lg font-medium transition ease-in-out duration-300',
                        index > 0 && 'ml-2', // Add margin left for all tabs except the first
                        activeTab === tab.key
                            ? 'bg-gray-900 text-white'
                            : 'bg-gray-200 text-gray-700'
                    )}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );

    return (
        <div className="fixed inset-0 bg-gray-400/25 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-3xl max-h-[90vh] p-6 rounded-2xl relative shadow-lg overflow-hidden">
                <h2 className="text-2xl font-semibold mb-4">{title}</h2>
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg font-bold"
                >
                    &times;
                </button>
                {tabs && renderTabs()}
                <div className="overflow-y-auto max-h-[60vh] pr-2">
                    {tabs ? (
                        children[activeTab]
                    ) : (
                        children
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modal;