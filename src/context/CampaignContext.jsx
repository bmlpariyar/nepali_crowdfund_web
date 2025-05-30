import { createContext, useContext, useState } from "react";

const CampaignContext = createContext();
const defaultData = {
  title: "",
  story: "",
  funding_goal: "",
  deadline: "",
  category_id: "",
  image_url: "",
  video_url: "",
  country: "",
};

export const useCampaign = () => useContext(CampaignContext);

export const CampaignProvider = ({ children }) => {
  const [campaignData, setCampaignData] = useState(defaultData);

  const updateCampaign = (data) => {
    setCampaignData((prev) => ({ ...prev, ...data }));
  };

  const resetCampaign = () => setCampaignData(defaultData);
  return (
    <CampaignContext.Provider
      value={{ campaignData, updateCampaign, resetCampaign }}
    >
      {children}
    </CampaignContext.Provider>
  );
};
