import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { createCampaign } from "../../services/apiService";
import { useCampaign } from "../../context/CampaignContext";
import { toast } from "react-toastify";
import { ArrowLeft, CheckCircle, XCircle, Calendar, MapPin, DollarSign, Image } from "lucide-react";

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
    <>
      {campaignData && (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-4xl font-extrabold text-gray-900">Campaign Preview</h1>

            </div>

            {/* Card */}
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
              <div className="relative h-64 w-full">
                {campaignData.cover_image ? (
                  <img
                    src={
                      typeof campaignData.cover_image === "string"
                        ? campaignData.cover_image
                        : URL.createObjectURL(campaignData.cover_image)
                    }
                    alt="Cover"
                    className="object-cover h-full w-full"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-100">
                    <Image className="h-12 w-12 text-gray-400" />
                    <span className="ml-2 text-gray-500">No Cover Image</span>
                  </div>
                )}
              </div>

              <div className="p-8 space-y-6">
                <h2 className="text-3xl font-bold text-gray-800">{campaignData.title}</h2>
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4" dangerouslySetInnerHTML={{ __html: campaignData.story }}>
                </div>


                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="h-6 w-6 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-500">Funding Goal</p>
                      <p className="text-lg font-semibold text-gray-800">
                        ${campaignData.funding_goal.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="h-6 w-6 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">Deadline</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {new Date(campaignData.deadline).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPin className="h-6 w-6 text-red-500" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      {campaignData.latitude && campaignData.longitude ? (
                        <>
                          {Number(campaignData.latitude).toFixed(4)}, {Number(campaignData.longitude).toFixed(4)}
                        </>
                      ) : (
                        <span className="text-gray-400 italic">Location not set</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 sm:col-span-2 lg:col-span-1">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium">
                      Category
                    </span>
                    <p className="text-lg font-medium text-gray-700">
                      {campaignData.category_name || campaignData.category_id}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <hr className="border border-gray-200 mt-10 mb-3" />
            <div className="max-w-4xl mx-auto flex justify-between items-center">
              <Link
                to="/create/campaign/step4"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 transition"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Link>

              <button
                onClick={handleSubmit}
                className="inline-flex items-center px-5 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 transition"
              >
                <CheckCircle className="mr-2 h-5 w-5" /> Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

};

export default PreviewPage;
