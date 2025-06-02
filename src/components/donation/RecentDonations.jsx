import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { getAllDonations, getTopDonations } from '../../services/apiService';
import { formatDistanceToNowStrict } from 'date-fns';

const RecentDonations = ({ campaignId }) => {
    const [allDonations, setAllDonations] = useState([]);
    const [topDonations, setTopDonations] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [initialTab, setInitialTab] = useState('all');

    const tabs = [
        { key: "all", label: "All" },
        { key: "top", label: "Top" },

    ];

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const [allRes, topRes] = await Promise.all([
                    getAllDonations(campaignId),
                    getTopDonations(campaignId),
                ]);
                setAllDonations(allRes.data);
                setTopDonations(topRes.data);
            } catch (error) {
                console.error("Error fetching donations:", error);
            }
        };

        fetchDonations();
    }, [campaignId]);

    const handleOpenModal = (tabKey = "all") => {
        setShowModal(true);
        setInitialTab(tabKey);
    };

    // Render donation list component
    const renderDonationList = (donations) => (
        <div className="space-y-4">
            {donations.map((donation) => (
                <div key={donation.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {donation?.user?.avatar_url ? (
                            <img
                                src={donation.user.avatar_url}
                                alt={donation.user.full_name}
                                className="w-8 h-8 rounded-full object-cover"
                            />
                        ) : (
                            <span className="text-xs font-medium text-pink-700">
                                {donation?.user?.full_name?.[0] || 'A'}
                            </span>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900">
                            {donation?.user?.full_name || 'Anonymous'}
                        </div>
                        <div className="text-sm text-gray-600">
                            <span className="font-bold text-gray-900">
                                Rs {donation?.amount}
                            </span>{' '}
                            •{' '}
                            {formatDistanceToNowStrict(new Date(donation?.created_at), {
                                addSuffix: true,
                            })}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    // Create children object for modal tabs
    const modalChildren = {
        all: renderDonationList(allDonations),
        top: renderDonationList(topDonations),
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Recent Donations</h3>
            <div className="space-y-4">
                {allDonations.slice(0, 3).map((donation) => (
                    <div key={donation.id} className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <img src="https://placehold.co/400" alt="" className='w-8 h-8 rounded-full object-cover' />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900">{donation?.user?.full_name}</div>
                            <div className="text-sm text-gray-600">Rs {donation?.amount} • Recent donation</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 flex gap-3">
                <button
                    onClick={() => handleOpenModal('all')}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm">
                    All
                </button>
                <button
                    onClick={() => handleOpenModal('top')}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm">
                    Top
                </button>
            </div>

            {showModal && (
                <Modal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    title={`Donations`}
                    tabs={tabs}
                    initialTab={initialTab}
                >
                    {modalChildren}
                </Modal>
            )}
        </div>
    );
};

export default RecentDonations;