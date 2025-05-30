import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchCategories } from "../../services/apiService"; // ✅ using your existing service
import { useCampaign } from "../../context/CampaignContext";

const CreatePage1 = () => {
  const [country, setCountry] = useState("United States");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [formError, setFormError] = useState("");
  const { campaignData, updateCampaign } = useCampaign();

  useEffect(() => {
    const loadCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const response = await fetchCategories(); // ✅ your custom API service
        setCategories(response.data || []);
        setFormError("");
      } catch (err) {
        console.error("Error fetching categories:", err);
        setFormError("Failed to load categories. Please try refreshing.");
      } finally {
        setIsLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    if (campaignData.country) setCountry(campaignData.country);
    if (campaignData.category_id) {
      const cat = categories.find((c) => c.id === campaignData.category_id);
      if (cat) setSelectedCategory(cat.name);
    }
  }, [categories, campaignData]);

  return (
    <div className="min-h-screen flex bg-white text-gray-800">
      {/* Left Sidebar */}
      <div className="w-1/4 bg-gray-100 px-6 py-24 flex flex-col justify-center">
        <div>
          <h1 className="text-2xl font-semibold mb-3">
            Let's begin your fundraising journey
          </h1>
          <p className="text-gray-600 text-sm">
            We're here to guide you every step of the way.
          </p>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="w-3/4 px-12 py-24 flex flex-col justify-between bg-white">
        <div className="max-w-2xl w-full mx-auto">
          {/* Location Selection */}
          <div className="mb-10">
            <label className="block text-lg font-semibold mb-2">
              Where are you located?
            </label>
            <div className="flex gap-4">
              <select
                className="w-1/2 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500"
                value={country}
                onChange={(e) => {
                  const newCountry = e.target.value;
                  setCountry(newCountry);
                  updateCampaign({ country: newCountry });
                }}
              >
                <option value="United States">United States</option>
                <option value="Nepal">Nepal</option>
                <option value="India">India</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Category Selection */}
          <div className="mb-10">
            <label className="block text-lg font-semibold mb-3">
              What best describes why you're fundraising?
            </label>
            {formError && (
              <p className="text-red-500 text-sm mb-3">{formError}</p>
            )}
            <div className="flex flex-wrap gap-3">
              {isLoadingCategories ? (
                <p>Loading categories...</p>
              ) : (
                categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.name);
                      updateCampaign({ category_id: cat.id });
                    }}
                    className={`px-4 py-2 rounded-full border text-sm font-medium transition ${
                      selectedCategory === cat.name
                        ? "bg-green-600 text-white border-green-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-green-100"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="mt-16">
          <hr className="border border-gray-300 mb-6" />
          <div className="flex justify-end">
            <Link
              to="/create/campaign/step2"
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-medium"
            >
              Continue
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePage1;
