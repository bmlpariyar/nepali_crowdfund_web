import { useNavigate, Link } from "react-router-dom";

import { createCampaign } from "../../services/apiService";
import { useCampaign } from "../../context/CampaignContext";
import { toast } from "react-toastify";

const PreviewPage = () => {
  const navigate = useNavigate();

  const { campaignData, resetCampaign } = useCampaign();

  const handleSubmit = async () => {
    try {
      const response = await createCampaign(campaignData);
      toast.success("Campaign created successfully!");
      resetCampaign();
      navigate(`/campaigns/${response.data.id}`);
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to create campaign. Please try again.");
    }
  };

  return (
    <div className="p-10 max-w-5xl mx-auto">

      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 space-y-4">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Preview Campaign
        </h2>
        <div>
          <p className="text-lg font-semibold text-gray-700">Title</p>
          <p className="text-gray-800">{campaignData.title}</p>
        </div>

        <div>
          <p className="text-lg font-semibold text-gray-700">Story</p>
          <p className="text-gray-800 whitespace-pre-line">{campaignData.story}</p>
        </div>

        <div className="">
          <div>
            <p className="text-lg font-semibold text-gray-700">Funding Goal</p>
            <p className="text-gray-800">${campaignData.funding_goal}</p>
          </div>

          <div>
            <p className="text-lg font-semibold text-gray-700">Deadline</p>
            <p className="text-gray-800">{campaignData.deadline}</p>
          </div>

          <div>
            <p className="text-lg font-semibold text-gray-700">Category</p>
            <p className="text-gray-800">{campaignData.category_id}</p>
          </div>
        </div>

        <div>
          <p className="text-lg font-semibold text-gray-700 mb-2">Cover Image</p>
          {campaignData.cover_image ? (
            <img
              src={
                typeof campaignData.cover_image === "string"
                  ? campaignData.cover_image
                  : URL.createObjectURL(campaignData.cover_image)
              }
              alt="Campaign Cover"
              className="w-full h-64 object-cover rounded-md border"
            />
          ) : (
            <p className="text-gray-500">No cover image provided.</p>
          )}
        </div>

        <div>
          <p className="text-lg font-semibold text-gray-700">Video URL</p>
          <p className="text-blue-600 break-words">{campaignData.video_url}</p>
        </div>
      </div>

      {/* ===Footer section=== */}
      <div className="mt-16">
        <hr className="border border-gray-300 mb-6" />
        <div className="flex justify-between items-center">
          <Link
            to="/create/campaign/step4"
            className="bg-gray-600 hover:bg-gray-700 text-white font-medium px-6 py-2 rounded-lg transition"
          >
            Back
          </Link>

          <button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-lg transition"
          >
            Submit Campaign
          </button>
        </div>
      </div>
    </div>

  );
};

export default PreviewPage;
