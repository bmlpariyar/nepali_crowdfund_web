// src/components/CreateCampaignPage.js
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createCampaign, fetchCategories } from "../services/apiService";

function CreateCampaignPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [fundingGoal, setFundingGoal] = useState("");
  const [deadline, setDeadline] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const [categories, setCategories] = useState([]);
  const [formError, setFormError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // Fetch categories for the dropdown
  useEffect(() => {
    const loadCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const response = await fetchCategories();
        setCategories(response.data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setFormError("Failed to load categories. Please try refreshing.");
      } finally {
        setIsLoadingCategories(false);
      }
    };
    loadCategories();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});
    setIsLoading(true);

    // Basic frontend validation
    if (!title || !story || !fundingGoal || !deadline || !categoryId) {
      setFormError(
        "Please fill in all required fields: Title, Story, Goal, Deadline, and Category."
      );
      setIsLoading(false);
      return;
    }

    const campaignData = {
      title,
      story,
      funding_goal: parseFloat(fundingGoal), // Ensure it's a number
      deadline, // Ensure format is YYYY-MM-DD or compatible with Rails
      category_id: parseInt(categoryId), // Ensure it's a number
      image_url: imageUrl || null, // Send null if empty
      video_url: videoUrl || null,
    };

    try {
      const response = await createCampaign(campaignData);
      navigate(`/campaigns/${response.data.id}`);
    } catch (err) {
      console.error("Error creating campaign:", err.response);
      if (err.response && err.response.data && err.response.data.errors) {
        // Handle Rails validation errors (usually an array or object)
        if (Array.isArray(err.response.data.errors)) {
          setFormError(err.response.data.errors.join(", "));
        } else if (typeof err.response.data.errors === "object") {
          // If errors are an object like { field: ["message"], ... }
          setFieldErrors(err.response.data.errors);
          setFormError("Please correct the highlighted errors.");
        } else {
          setFormError("An unknown error occurred during validation.");
        }
      } else {
        setFormError("Failed to create campaign. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingCategories) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-lg font-medium text-gray-600">
          Loading form prerequisites...
        </div>
      </div>
    );
  }

  if (categories.length === 0 && !isLoadingCategories) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl text-center">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline ml-2">
            Could not load categories. {formError || "Please refresh."}
          </span>
        </div>
        <Link
          to="/campaigns"
          className="text-indigo-600 hover:text-indigo-800 font-medium"
        >
          &larr; Back to Campaigns
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Back Link */}
      <Link
        to="/campaigns"
        className="text-sm text-indigo-600 hover:text-indigo-800 mb-6 inline-block"
      >
        &larr; Back to Campaigns
      </Link>

      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Create New Campaign
      </h2>

      {formError && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
          role="alert"
        >
          <p>{formError}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 mb-8"
      >
        <div className="mb-6">
          <label
            htmlFor="title"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Campaign Title: <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {fieldErrors.title && (
            <p className="text-red-500 text-xs italic mt-1">
              {fieldErrors.title.join(", ")}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label
            htmlFor="story"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Story/Description: <span className="text-red-500">*</span>
          </label>
          <textarea
            id="story"
            value={story}
            onChange={(e) => setStory(e.target.value)}
            rows="10"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {fieldErrors.story && (
            <p className="text-red-500 text-xs italic mt-1">
              {fieldErrors.story.join(", ")}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label
            htmlFor="fundingGoal"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Funding Goal (NPR): <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="fundingGoal"
            value={fundingGoal}
            onChange={(e) => setFundingGoal(e.target.value)}
            required
            min="1"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {fieldErrors.funding_goal && (
            <p className="text-red-500 text-xs italic mt-1">
              {fieldErrors.funding_goal.join(", ")}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label
            htmlFor="deadline"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Deadline: <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="deadline"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {fieldErrors.deadline && (
            <p className="text-red-500 text-xs italic mt-1">
              {fieldErrors.deadline.join(", ")}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label
            htmlFor="category"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Category: <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {fieldErrors.category_id && (
            <p className="text-red-500 text-xs italic mt-1">
              {fieldErrors.category_id.join(", ")}
            </p>
          )}
          {fieldErrors.category && (
            <p className="text-red-500 text-xs italic mt-1">
              {fieldErrors.category.join(", ")}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label
            htmlFor="imageUrl"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Image URL (Optional):
          </label>
          <input
            type="url"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="videoUrl"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Video URL (e.g., YouTube - Optional):
          </label>
          <input
            type="url"
            id="videoUrl"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="flex items-center justify-center">
          <button
            type="submit"
            disabled={isLoading || isLoadingCategories}
            className={`bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline ${isLoading || isLoadingCategories
              ? "opacity-60 cursor-not-allowed"
              : ""
              }`}
          >
            {isLoading ? "Creating..." : "Create Campaign"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateCampaignPage;
