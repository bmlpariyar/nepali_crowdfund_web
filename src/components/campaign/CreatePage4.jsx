import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCampaign } from "../../context/CampaignContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CreatePage4 = () => {
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const { campaignData, updateCampaign } = useCampaign();
  const navigate = useNavigate();

  useEffect(() => {
    if (campaignData.title) setTitle(campaignData.title);
    if (campaignData.story) setStory(campaignData.story);
  }, [campaignData]);

  const handleNext = () => {
    if (!title || !story) {
      toast.error("Please add a title and story.");
      return;
    }
    navigate("/create/campaign/preview");
  };

  return (
    <div className="min-h-screen flex bg-white text-gray-800">
      {/* Left Sidebar */}
      <div className="w-1/4 bg-gray-100 px-6 py-24 flex flex-col justify-center">
        <div className="pl-8">
          <h1 className="text-2xl font-semibold mb-3">
            Tell us about your campaign
          </h1>
          <span className="text-gray-600 text-sm space-y-1">
            <ul className="list-disc list-inside space-y-1">
              <li>What is your campaign about?</li>
              <li>Why is it important to you?</li>
              <li>How will the funds be used?</li>
              <li>What impact do you hope to achieve?</li>
            </ul>
          </span>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="w-3/4 px-12 py-28 flex flex-col justify-between bg-white">
        <div className="max-w-xl w-full mx-auto">
          {/* Title Input */}
          <div className="mb-8 relative">
            <label className="block mb-2 text-gray-700 text-lg font-bold">
              Campaign Title
            </label>
            <input
              type="text"
              placeholder="Give your campaign a title"
              className="border border-gray-300 focus:ring-2 focus:ring-green-500 p-3 rounded-lg w-full text-base placeholder-gray-500"
              value={title}
              onChange={(e) => {
                const value = e.target.value;
                setTitle(value);
                updateCampaign({ title: value });
              }}
            />
          </div>

          {/* Story Textarea */}
          <div className="relative mb-6">
            <label className="block mb-2 text-gray-700 text-lg font-bold">
              Campaign Story
            </label>
            <textarea
              placeholder="Tell your story. Why are you raising funds? How will they be used?"
              className="border border-gray-300 focus:ring-2 focus:ring-green-500 p-3 rounded-lg w-full h-48 text-base resize-none placeholder-gray-500"
              value={story}
              onChange={(e) => {
                const value = e.target.value;
                setStory(value);
                updateCampaign({ story: value });
              }}
            />
          </div>
        </div>

        {/* Footer Section */}
        <div className="mt-16">
          <hr className="border border-gray-300 mb-6" />
          <div className="flex justify-between items-center">
            <Link
              to="/create/campaign/step3"
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition font-medium"
            >
              Back
            </Link>
            <button
              onClick={handleNext}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-medium"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePage4;
