import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { fetchCategories } from "../../services/apiService"; // ✅ using your existing service
import { useCampaign } from "../../context/CampaignContext";
import { toast } from "react-toastify";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { fetchLocation } from "../../services/apiService";


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});


const LocationMarker = ({ setLatitude, setLongitude }) => {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition(e.latlng);
      setLatitude(lat);
      setLongitude(lng);
    },
  });

  return position ? <Marker position={position} /> : null;
};



const CreatePage1 = () => {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [location, setLocation] = useState("");

  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const { campaignData, updateCampaign } = useCampaign();
  const navigate = useNavigate();


  useEffect(() => {
    if (!latitude || !longitude) return;

    fetchLocation(latitude, longitude)
      .then((response) => {
        setLocation(response.data.display_name);
      })
      .catch((error) => {
        console.error('Failed to fetch location:', error);
      });
  }, [latitude, longitude]);


  useEffect(() => {
    const loadCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const response = await fetchCategories(); // ✅ your custom API service
        setCategories(response.data || []);

      } catch (err) {
        console.error("Error fetching categories:", err);
        toast.error("Failed to load categories. Please try refreshing.");
      } finally {
        setIsLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    if (latitude && longitude) {
      updateCampaign({ latitude: latitude, longitude: longitude });
    }
  }, [latitude, longitude]);


  useEffect(() => {
    if (campaignData.category_id) {
      const cat = categories.find((c) => c.id === campaignData.category_id);
      if (cat) setSelectedCategory(cat.name);
    }
  }, [categories, campaignData]);

  const handleNext = () => {
    if (!latitude || !longitude || !selectedCategory) {
      toast.error("Please select both location and category.");
      return;
    }

    navigate("/create/campaign/step2");
  };

  return (
    <div className="min-h-screen flex bg-white text-gray-800">
      {/* Left Sidebar */}
      <div className="w-1/4 bg-gray-100 px-6 py-24 flex flex-col justify-center">
        <div className="pl-8">
          <h1 className="text-2xl font-semibold mb-3">
            Let's begin your fundraising journey
          </h1>
          <p className="text-gray-600 text-sm">
            We're here to guide you every step of the way.
          </p>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="z-10 w-3/4 px-12 py-28 flex flex-col justify-between bg-white overflow-x-hidden">
        <div className="max-w-2xl w-full mx-auto">
          {/* Location Selection */}
          <div className="mb-10">
            <label className="block text-lg font-semibold mb-2">
              Where are you located?
            </label>

            <div className="mb-10">
              <label className="block text-lg font-semibold mb-2">
                Select your location on the map
              </label>
              <MapContainer
                center={[27.7, 85.3]}
                zoom={10}
                scrollWheelZoom={true}
                className="h-96 w-full max-h-[400px] rounded-lg border border-gray-300 shadow-sm overflow-hidden"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                />
                <LocationMarker setLatitude={setLatitude} setLongitude={setLongitude} />
              </MapContainer>

              {location && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    <p className="font-bold text-xl">Selected Location:</p>
                    <p className="text-md italic">{location}</p>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Category Selection */}
          <div className="mb-10">
            <label className="block text-lg font-semibold mb-3">
              What best describes why you're fundraising?
            </label>

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
                    className={`px-4 py-2 rounded-full border text-sm font-medium transition ${selectedCategory === cat.name
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
            <button
              onClick={handleNext}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-medium"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div >
  );
};

export default CreatePage1;
