import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCampaign } from "../../context/CampaignContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CreatePage2 = () => {
  const [fundingGoal, setFundingGoal] = useState("");
  const [deadline, setDeadline] = useState("");
  const { campaignData, updateCampaign } = useCampaign();
  const navigate = useNavigate();

  useEffect(() => {
    if (campaignData.deadline) setDeadline(campaignData.deadline);
    if (campaignData.funding_goal) setFundingGoal(campaignData.funding_goal);
  }, [campaignData]);

  const handleNext = () => {
    if (!fundingGoal || !deadline) {
      toast.error("Please add funding goal and deadline.");
      return;
    }

    navigate("/create/campaign/step3");
  };


  return (
    <div className="min-h-screen flex bg-white text-gray-800">
      {/* Left Sidebar */}
      <div className="w-1/4 bg-gray-100 px-6 py-24 flex flex-col justify-center">
        <div className="pl-8">
          <h1 className="text-2xl font-semibold mb-3">
            How much would you like to raise?
          </h1>
          <p className="text-gray-600 text-sm">
            You can always change this later, so don't worry about getting it
            perfect now.
          </p>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="w-3/4 px-12 py-28 bg-white flex flex-col justify-between">
        <div className="max-w-xl w-full mx-auto">
          <label className="block mb-2 text-gray-700 text-sm font-medium">
            Enter Target Amount (in NPR)
          </label>
          <input
            type="number"
            placeholder="e.g. 100000"
            className="border border-gray-300 focus:ring-2 focus:ring-green-500 p-3 rounded-lg w-full mb-6 text-lg"
            value={fundingGoal}
            onChange={(e) => {
              const value = e.target.value;
              setFundingGoal(value);
              updateCampaign({ funding_goal: value });
            }}
            min="0"
          />

          <label className="block mb-2 text-gray-700 text-sm font-medium">
            Enter Deadline (in days)
          </label>
          <input
            type="date"
            placeholder=""
            className="border border-gray-300 focus:ring-2 focus:ring-green-500 p-3 rounded-lg w-full mb-6 text-lg"
            value={deadline}
            onChange={(e) => {
              const value = e.target.value;
              setDeadline(value);
              updateCampaign({ deadline: value });
            }}
            min="1"
          />

          <p className="text-gray-600 text-sm mb-3">
            Keep in mind that transaction fees will be deducted from the raised
            amount.
          </p>

          <div className="bg-green-100 text-green-800 text-sm rounded-lg p-4">
            <p className="font-semibold mb-2">
              To withdraw the amount, you’ll need:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>A Nepali bank account</li>
              <li>A valid ID (Citizenship, License, etc.)</li>
            </ul>
          </div>
        </div>

        {/* Footer Section */}
        <div className="mt-16">
          <hr className="border border-gray-300 mb-6" />
          <div className="flex justify-between items-center">
            <Link
              to="/create/campaign/step1    "
              className={`bg-gray-600 hover:bg-gray-700 text-white font-medium px-6 py-2 rounded-lg transition`}
            >
              Back
            </Link>
            <button
              onClick={handleNext}
              className={`bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-lg transition`}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePage2;
