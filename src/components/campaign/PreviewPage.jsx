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
    <div className="p-10 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Preview Campaign</h2>
      <p>
        <strong>Title:</strong> {campaignData.title}
      </p>
      <p>
        <strong>Story:</strong> {campaignData.story}
      </p>
      <p>
        <strong>Goal:</strong> ${campaignData.funding_goal}
      </p>
      <p>
        <strong>Deadline:</strong> {campaignData.deadline}
      </p>
      <p>
        <strong>Category ID:</strong> {campaignData.category_id}
      </p>
      <img
        src={
          typeof campaignData.cover_image === "string"
            ? campaignData.cover_image
            : campaignData.cover_image
              ? URL.createObjectURL(campaignData.cover_image)
              : ""
        }
        alt="Campaign Cover"
        className="w-full h-64 object-cover rounded-lg border border-gray-300 mb-4"
      />
      <p>
        <strong>Video URL:</strong> {campaignData.video_url}
      </p>

      {/* ===Footer section=== */}
      <div className="mt-16">
        <hr className="border border-gray-300 mb-6" />
        <div className="flex justify-between items-center">
          <Link
            to="/create/campaign/step4"
            className={`bg-gray-600 hover:bg-gray-700 text-white font-medium px-6 py-2 rounded-lg transition`}
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
