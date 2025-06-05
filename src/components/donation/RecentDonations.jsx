import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { getAllDonations, getTopDonations, donation_highlight } from '../../services/apiService';
import { formatDistanceToNowStrict } from 'date-fns';
import clsx from 'clsx';
import { startCase } from 'lodash';
import Button from '../ui/Button';

const RecentDonations = ({ campaignId, refreshTrigger }) => {
    const [allDonations, setAllDonations] = useState([]);
    const [topDonations, setTopDonations] = useState([]);
    const [highlightedDonation, setHighlightedDonation] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [initialTab, setInitialTab] = useState('all');

    const tabs = [
        { key: "all", label: "All" },
        { key: "top", label: "Top" },

    ];

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const [allRes, topRes, highlightRes] = await Promise.all([
                    getAllDonations(campaignId),
                    getTopDonations(campaignId),
                    donation_highlight(campaignId)
                ]);
                setAllDonations(allRes.data);
                setTopDonations(topRes.data);
                setHighlightedDonation(highlightRes.data);
            } catch (error) {
                console.error("Error fetching donations:", error.message);
            }
        };

        fetchDonations();
    }, [campaignId, refreshTrigger]);

    const handleOpenModal = (tabKey = "all") => {
        setShowModal(true);
        setInitialTab(tabKey);
    };

    // Render donation list component
    const renderDonationList = (donations) => (
        <div className="space-y-4">
            {donations.map((donation) => (
                <div div key={donation.id} className="flex items-center gap-3" >
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
                            {donation?.is_anonymous ? 'Anonymous' : donation?.user?.full_name}
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
            ))
            }
        </div >
    );

    // Create children object for modal tabs
    const modalChildren = {
        all: renderDonationList(allDonations),
        top: renderDonationList(topDonations),
    };
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Recent Donations</h3>

            {highlightedDonation && !Array.isArray(highlightedDonation) ? (
                <div className="space-y-4">
                    {['recent_donation', 'top_donation', 'first_donation'].map((key) => {
                        const donation = highlightedDonation?.[key];
                        if (!donation) return null;

                        return (
                            <div key={`${donation.id}-${key}`} className="flex items-center gap-3">
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
                                        {donation.is_anonymous ? 'Anonymous' : donation.user.full_name}
                                    </div>

                                    <div className="text-sm text-gray-600">
                                        Rs {donation.amount}


                                        <span className={clsx(
                                            'relative overflow-hidden text-white bg-gradient-to-r ml-3 text-[0.6rem] px-4 py-1 rounded-full transition-all duration-300 transform',
                                            key === 'recent_donation' ? 'from-green-500 to-teal-600' :
                                                key === 'top_donation' ? 'from-yellow-500 to-amber-600' :
                                                    'from-red-500 to-rose-600'
                                        )}>
                                            <span className="relative z-10">{startCase(key.replace('_', ' '))}</span>
                                            <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-swipe-light"></div>
                                        </span>

                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-gray-500 text-sm text-center">
                    No donations yet. Be the first to support this campaign!
                </div>)}


            <div className="mt-6 flex gap-3">
                <Button
                    onClick={() => handleOpenModal('all')}
                >
                    All
                </Button>
                <Button
                    onClick={() => handleOpenModal('top')}
                >
                    Top
                </Button>
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