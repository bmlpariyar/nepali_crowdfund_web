import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import khaltiLogo from '../../assets/images/khalti_t.png';
import esewaLogo from '../../assets/images/esewa_t.png';
import { toast } from 'react-toastify';
import { initiateKhaltiPayment } from '../../services/apiService'; // Import the service

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
    const [donationSuccess, setDonationSuccess] = useState(null);
    const [isDonating, setIsDonating] = useState(false);
    const [selectedAmount, setSelectedAmount] = useState(null);
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [supportMessage, setSupportMessage] = useState('');

    const handleDonationSubmit = async (event) => {
        event.preventDefault();

        if (!user) {
            toast.error("Please log in to make a donation.");
            return;
        }
        if (!donationAmount || parseFloat(donationAmount) <= 0) {
            toast.error("Please enter a valid donation amount.");
            return;
        }

        setIsDonating(true);
        toast.error(null);
        setDonationSuccess(null);

        try {
            const donationData = {
                amount: parseFloat(donationAmount),
                is_anonymous: isAnonymous,
                support_message: supportMessage || ''
            };
            const response = await makeDonation(campaignId, donationData);
            const donatedAmount = parseFloat(response.data.donation?.amount);
            toast.success(`Thank you for your donation of NPR ${donatedAmount}!`);
            setDonationSuccess(true);
            setDonationAmount('');
            setSupportMessage('');
            setSelectedAmount(null);
            setIsAnonymous(false);
            toast.error(null);

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

            setDonationAmount('');
        } catch (err) {
            console.error("Donation failed:", err.response);
            if (err.response?.data?.errors) {
                toast.error(err.response.data.errors.join(', '));
            } else if (err.response?.data?.error) {
                toast.error(err.response.data.error);
            } else {
                toast.error("Donation failed. Please try again.");
            }
        } finally {
            setIsDonating(false);
        }
    };

    const handleKhaltiPayment = async () => {
        if (!user) {
            toast.error("Please log in to make a donation.");
            toast.error("Please log in to make a donation.");
            return;
        }

        if (!donationAmount || parseFloat(donationAmount) <= 0) {
            toast.error("Please enter a valid donation amount.");
            toast.error("Please enter a valid donation amount.");
            return;
        }

        setIsDonating(true);
        toast.error(null);
        const currentPath = window.location.pathname;
        // Prepare payment payload
        const payload = {
            return_url: `${window.location.origin}${currentPath}`,
            website_url: window.location.origin,
            amount: parseFloat(donationAmount), // amount in NPR
            purchase_order_id: `donation_${campaignId}_${Date.now()}`,
            purchase_order_name: `Donation to ${campaign?.title || "Campaign"}`,
            customer_info: {
                name: user?.full_name || user?.name || "Guest",
                email: user?.email || "",
                phone: user?.phone || user?.phone_number || ""
            },
            amount_breakdown: {
                label: "Donation Amount",
                amount: Math.round(parseFloat(donationAmount) * 100) // amount in paisa
            },
            product_details: {
                identity: `campaign_${campaignId}`,
                name: campaign?.title || "Campaign Donation",
                total_price: Math.round(parseFloat(donationAmount) * 100), // amount in paisa
                quantity: 1,
                unit_price: Math.round(parseFloat(donationAmount) * 100) // amount in paisa
            },


        };

        try {
            console.log('Initiating Khalti payment with payload:', payload);

            const response = await initiateKhaltiPayment(payload);
            console.log('Khalti payment response:', response.data);

            // Check if payment initiation was successful
            if (response.data && !response.data.error) {
                const paymentUrl = response.data.payment_url;

                if (paymentUrl) {
                    // Store donation details in localStorage for later use
                    localStorage.setItem('pendingDonation', JSON.stringify({
                        campaignId,
                        amount: parseFloat(donationAmount),
                        isAnonymous,
                        supportMessage,
                        orderId: payload.purchase_order_id
                    }));

                    // Redirect to Khalti payment page
                    window.location.href = paymentUrl;
                } else {
                    toast.error("Failed to get payment URL from Khalti.");
                    setIsDonating(false);
                }
            } else {
                const errorMessage = response.data?.message || "Failed to initiate payment";
                toast.error(errorMessage);
                toast.error(errorMessage);
                setIsDonating(false);
            }
        } catch (error) {
            console.error("Error initiating Khalti payment:", error);

            let errorMessage = "Error initiating payment. Please try again.";

            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            }

            toast.error(errorMessage);
            toast.error(errorMessage);
            setIsDonating(false);
        }
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const status = params.get("status");
        const amount = parseFloat(params.get("amount")) / 100; // convert paisa to NPR
        const orderId = params.get("purchase_order_id");

        if (status === "Completed" && orderId?.startsWith("donation_")) {
            const stored = JSON.parse(localStorage.getItem("pendingDonation"));

            if (stored && stored.orderId === orderId) {
                // Simulate form submission
                confirmKhaltiDonation(stored.campaignId, amount, stored.isAnonymous, stored.supportMessage);
                localStorage.removeItem("pendingDonation");
            }
        }
    }, []);

    const confirmKhaltiDonation = async (campaignId, amount, isAnonymous, supportMessage) => {
        try {
            setIsDonating(true);
            const donationData = {
                amount: parseFloat(amount),
                is_anonymous: isAnonymous,
                support_message: supportMessage || ""
            };
            const response = await makeDonation(campaignId, donationData);
            const donatedAmount = parseFloat(response.data.donation?.amount);

            toast.success(`Thank you for your donation of NPR ${donatedAmount}!`);
            setCampaign(prev => ({
                ...prev,
                current_amount: parseFloat(prev.current_amount || 0) + donatedAmount
            }));
        } catch (err) {
            console.error("Donation confirmation failed:", err);
            toast.error("Failed to confirm Khalti payment. Please try again.");
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
        <div className="fixed inset-0 bg-gray-400/25 backdrop-blur-sm z-50 overflow-auto px-4 py-8">
            <div className="bg-white w-full max-w-3xl mx-auto p-6 rounded-2xl relative shadow-lg max-h-[90vh] overflow-y-auto">
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
                            <p className='text-sm text-gray-400'>
                                Your donation will support <strong className='text-gray-600'>{campaign.user.full_name}</strong>
                            </p>
                        </div>
                    </div>
                    <h2 className="text-xl font-semibold mb-4">Enter your donation</h2>
                    <div className="flex flex-wrap justify-around mt-4 space-x-2 mb-5">
                        {['500', '1000', '2000', '5000', '10000'].map(amount => (
                            <button
                                key={amount}
                                className={`py-4 px-6 border-2 rounded-xl font-bold transition duration-150 cursor-pointer ease-in-out ${selectedAmount === amount
                                    ? 'bg-green-500 text-white hover:bg-green-600'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                onClick={() => {
                                    if (selectedAmount === amount) {
                                        setSelectedAmount(null);
                                        setDonationAmount('');
                                    } else {
                                        setSelectedAmount(amount);
                                        setDonationAmount(amount);
                                    }
                                }}
                            >
                                Rs {amount}
                            </button>
                        ))}
                    </div>
                </div>
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
                                onChange={(e) => {
                                    setDonationAmount(e.target.value);
                                    setSelectedAmount(null); // Clear selected amount when typing
                                }}
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

                                <button
                                    type="button"
                                    onClick={handleKhaltiPayment}
                                    disabled={isDonating}
                                    className="bg-transparent border-none focus:outline-none disabled:opacity-50"
                                >
                                    <img
                                        src={khaltiLogo}
                                        alt="Pay with Khalti"
                                        className={`w-36 h-auto cursor-pointer transition-transform ${!isDonating ? 'hover:scale-105' : ''
                                            }`}
                                    />
                                </button>
                            </div>
                        </div>

                        <div
                            onClick={() => setIsAnonymous(!isAnonymous)}
                            className="flex items-center mb-4 cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                checked={isAnonymous}
                                onChange={() => setIsAnonymous(!isAnonymous)}
                                className="mr-2 cursor-pointer w-5 h-5"
                            />
                            <label className="text-gray-700 text-lg cursor-pointer">
                                Donate anonymously
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isDonating}
                            className={`bg-indigo-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-indigo-700 ${isDonating ? 'opacity-60 cursor-not-allowed' : ''
                                }`}
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