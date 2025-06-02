import { useNavigate, Link } from "react-router-dom";

import { createCampaign } from "../../services/apiService";
import { useCampaign } from "../../context/CampaignContext";

const PreviewPage = () => {
  const navigate = useNavigate();

  const { campaignData, resetCampaign } = useCampaign();

  const handleSubmit = async () => {
    try {
      const response = await createCampaign(campaignData);
      alert("Campaign created successfully!");
      resetCampaign();
      navigate(`/campaigns/${response.data.id}`);
    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong!");
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

      <div>
        <Link
          to="/create/campaign/step4"
          className="mt-4 bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
        >
          Back
        </Link>
        <button
          onClick={handleSubmit}
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
        >
          Submit Campaign
        </button>
      </div>
    </div>
  );
};

export default PreviewPage;
