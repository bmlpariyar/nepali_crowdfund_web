import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import khaltiLogo from '../../assets/images/khalti_t.png';
import esewaLogo from '../../assets/images/esewa_t.png';
import { toast } from 'react-toastify';

const DonationModal = ({
    isOpen,
    onClose,
    user,
    campaign,
    campaignId,
    setCampaign,
    makeDonation,
    onDonationSuccess
}) => {
    const [donationAmount, setDonationAmount] = useState('');
    const [donationError, setDonationError] = useState(null);
    const [donationSuccess, setDonationSuccess] = useState(null);
    const [isDonating, setIsDonating] = useState(false);
    const [selectedAmount, setSelectedAmount] = useState(null);
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [supportMessage, setSupportMessage] = useState('');

    const handleDonationSubmit = async (event) => {
        event.preventDefault();

        if (!user) {
            setDonationError("Please log in to make a donation.");
            return;
        }
        if (!donationAmount || parseFloat(donationAmount) <= 0) {
            setDonationError("Please enter a valid donation amount.");
            return;
        }

        setIsDonating(true);
        setDonationError(null);
        setDonationSuccess(null);

        try {
            const donationData = { amount: parseFloat(donationAmount), is_anonymous: isAnonymous, support_message: supportMessage || '' };
            const response = await makeDonation(campaignId, donationData);
            const donatedAmount = parseFloat(response.data.donation?.amount);
            setDonationSuccess(`Thank you for your donation of NPR ${donatedAmount}!`);
            setDonationAmount('');
            setSupportMessage('');
            setSelectedAmount(null);
            setIsAnonymous(false);
            setDonationError(null);
            if (onDonationSuccess) {
                onDonationSuccess();
            }

            // Update campaign current amount
            let newAmount = parseFloat(campaign?.current_amount || 0) + donatedAmount;

            if (!isNaN(newAmount) && isFinite(newAmount)) {
                setCampaign(prev => ({
                    ...prev,
                    current_amount: newAmount
                }));
            }

            setDonationAmount(''); // Clear input
        } catch (err) {
            console.error("Donation failed:", err.response);
            if (err.response?.data?.errors) {
                setDonationError(err.response.data.errors.join(', '));
            } else if (err.response?.data?.error) {
                setDonationError(err.response.data.error);
            } else {
                setDonationError("Donation failed. Please try again.");
            }
        } finally {
            setIsDonating(false);
        }
    };

    // Close modal immediately on success
    useEffect(() => {
        if (donationSuccess) {
            onClose();
            setDonationSuccess(null);
        }
    }, [donationSuccess, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-400/25 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-3xl p-6 rounded-2xl relative shadow-lg">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg font-bold"
                >
                    &times;
                </button>

                <div>
                    <div className='grid grid-cols-3 w-full mb-2'>
                        <img
                            src={campaign?.cover_image_url}
                            className="w-52 h-32 rounded-lg mx-0 mb-4 col-span-1 object-cover"
                            alt="campaign image"
                        />
                        <div className='col-span-2 flex flex-col justify-start items-start'>
                            <b className='text-2xl'>{campaign?.title}</b>
                            <p className='text-sm text-gray-400'>Your donation will support <strong className='text-gray-600'>{campaign.user.full_name}</strong></p>
                        </div>
                    </div>
                    <h2 className="text-xl font-semibold mb-4 ">Enter your donation</h2>
                    <div className="flex flex-wrap justify-around mt-4 space-x-2 mb-5">
                        {['200', '500', '750', '1000', '1250', '2000'].map(amount => (
                            <button
                                key={amount}
                                className={`py-4 px-6 border-2 rounded-xl font-bold transition duration-150 cursor-pointer ease-in-out ${selectedAmount === amount ? 'bg-green-500 text-white hover:bg-green-600' : ' text-gray-700'}`}
                                onClick={() => {
                                    selectedAmount === amount ? setSelectedAmount(null) : setSelectedAmount(amount);
                                    setDonationAmount(amount)
                                }}
                            >
                                Rs {amount}
                            </button>
                        ))}
                    </div>
                </div>


                {donationSuccess && (
                    toast.success(donationSuccess)
                )}

                {donationError && (
                    toast.error(donationError)

                )}

                {user ? (
                    <form onSubmit={handleDonationSubmit} className="flex flex-col gap-4">
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-900 font-semibold text-2xl">
                                NRs
                            </span>
                            <input
                                type="number"
                                placeholder="Enter amount"
                                value={donationAmount}
                                onChange={(e) => setDonationAmount(e.target.value)}
                                min="1"
                                required
                                className="pl-20 pr-4 py-6 text-4xl font-bold border border-gray-300 rounded-xl w-full text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                        </div>


                        <div>
                            <label className="text-gray-700 font-bold my-3">
                                Support Message (optional)
                            </label>
                            <textarea
                                value={supportMessage}
                                onChange={(e) => setSupportMessage(e.target.value)}
                                placeholder="Write a message to the campaign owner"
                                className="border border-gray-300 rounded-lg p-3 w-full h-24 resize-none"
                            />
                        </div>
                        <div>
                            <p className='text-gray-950 font-bold'>Payment Method</p>
                            <div className='flex justify-start items-start gap-2'>
                                <img src={esewaLogo} alt="" className="w-20 h-auto cursor-pointer" />
                                <img src={khaltiLogo} alt="" className="w-20 h-auto cursor-pointer" />
                            </div>
                        </div>

                        <div onClick={() => setIsAnonymous(!isAnonymous)} className="flex items-center mb-4 cursor-pointer">
                            <input type="checkbox" checked={isAnonymous} onChange={() => setIsAnonymous(!isAnonymous)} className="mr-2 cursor-pointer w-5 h-5" />
                            <label className="text-gray-700 text-lg cursor-pointer " >
                                Donate anonymously
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isDonating}
                            className={`bg-indigo-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-indigo-700 ${isDonating ? 'opacity-60 cursor-not-allowed' : ''}`}
                        >
                            {isDonating ? 'Processing...' : 'Donate'}
                        </button>
                    </form>
                ) : (
                    <p className="text-center text-gray-600">
                        Please{' '}
                        <Link to="/login" className="text-indigo-600 font-medium hover:underline">
                            log in
                        </Link>{' '}
                        to donate.
                    </p>
                )}
            </div>
        </div>
    );
};

export default DonationModal;
