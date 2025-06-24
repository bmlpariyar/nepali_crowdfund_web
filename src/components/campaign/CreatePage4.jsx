import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useCampaign } from "../../context/CampaignContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { analyzeStory } from "../../services/apiService";
import { useDebounce } from "../../hooks/useDebounce";

const CreatePage4 = () => {
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const { campaignData, updateCampaign } = useCampaign();
  const navigate = useNavigate();

  const [suggestions, setSuggestions] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const debouncedStory = useDebounce(story, 1500);

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

  useEffect(() => {
    if (debouncedStory) { // Only run if there is text
      setIsAnalyzing(true);
      analyzeStory(debouncedStory)
        .then(response => {
          setSuggestions(response.data.suggestions);
        })
        .catch(error => {
          console.error("AI analysis error:", error);
        })
        .finally(() => {
          setIsAnalyzing(false);
        });
    }
  }, [debouncedStory]);

  return (
    <div className="min-h-screen flex bg-white text-gray-800">
      {/* Left Sidebar */}
      <div className="w-1/4 bg-gray-100 px-6  flex flex-col justify-center">
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
      <div className="w-3/4 px-12 py-8  flex flex-col justify-between bg-white">
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
            {isAnalyzing && <span className="absolute bottom-3 right-3 text-sm text-gray-500">Analyzing...</span>}
          </div>
          <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
            <h4 className="font-bold text-indigo-800">Storytelling Assistant</h4>
            <ul className="mt-2 list-inside">
              {suggestions.map(suggestion => (
                <li key={suggestion.id} className="flex items-center text-sm">
                  {suggestion.complete ? (
                    <span className="text-green-500 mr-2">✔️</span>
                  ) : (
                    <span className="text-yellow-500 mr-2">⚠️</span>
                  )}
                  <span className={suggestion.complete ? 'text-gray-600' : 'text-gray-800 font-semibold'}>
                    {suggestion.text}
                  </span>
                </li>
              ))}
            </ul>
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
