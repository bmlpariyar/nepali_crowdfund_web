import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useCampaign } from "../../context/CampaignContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import RichTextarea from "../ui/RichTextarea";
import { AIPrompt } from "../utils/AIPrompt";


const CreatePage4 = () => {
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const { campaignData, updateCampaign } = useCampaign();
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [error, setError] = React.useState(null);
  const navigate = useNavigate();
  const handleGenerateStory = async () => {

    if (isGenerating) return;
    setIsGenerating(true);
    setError(null);
    setStory('');





    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || "";

    if (apiKey === "") {
      setError("Please add your OpenRouter API key to the code.");
      setIsGenerating(false);
      return;
    }

    const promptText = AIPrompt({ title: title || 'Untitled Campaign' });


    try {
      // 3. --- Make the API Call to OpenRouter ---
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
          // Optional headers for OpenRouter ranking
          // "HTTP-Referer": "http://localhost:3000", 
          // "X-Title": "My Awesome Crowdfunding App"
        },
        body: JSON.stringify({
          // Using a free, high-quality model available on OpenRouter
          "model": "mistralai/mistral-7b-instruct:free",
          "messages": [
            { "role": "user", "content": promptText }
          ],
          // Enable streaming for a real-time effect
          "stream": true
        })
      });

      if (!response.ok) {
        // Handle API errors (e.g., invalid key, model not available)
        const errText = await response.text();
        throw new Error(`API Error: ${response.status} ${response.statusText} - ${errText}`);
      }

      // 4. --- Process the Streaming Response ---
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = '';
      let streamFinished = false;

      while (!streamFinished) {
        const { done, value } = await reader.read();
        if (done) {
          streamFinished = true;
          break;
        }

        // Add the new chunk to our buffer
        buffer += decoder.decode(value, { stream: true });

        // Split the buffer into lines, as a chunk can contain multiple lines
        const lines = buffer.split("\n");

        // The last line might be incomplete, so we keep it in the buffer for the next chunk
        buffer = lines.pop() || '';

        for (const line of lines) {
          // Skip empty lines
          if (!line) continue;

          // SSE data lines start with "data: "
          if (line.startsWith('data: ')) {
            const jsonStr = line.substring(6).trim();

            // The stream sends a '[DONE]' message to signal completion
            if (jsonStr === '[DONE]') {
              streamFinished = true;
              break;
            }

            // Try to parse the JSON string
            if (jsonStr) {
              try {
                const parsedLine = JSON.parse(jsonStr);
                const content = parsedLine.choices?.[0]?.delta?.content;
                if (content) {
                  // Append the new text chunk to the story
                  setStory(prevStory => {
                    const updated = prevStory + content;
                    updateCampaign({ story: updated }); // <-- sync to context each time it grows
                    return updated;
                  });
                }
              } catch (err) {
                // Catching errors if a line is not valid JSON, which can happen with streaming.
                // We log it but continue processing the stream.
                console.error('Error parsing JSON line from stream:', jsonStr, err);
              }
            }
          }
        }
      }

    } catch (err) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (campaignData.title) {
      setTitle(campaignData.title);
      updateCampaign({ title: campaignData.title });
    }

    if (campaignData.story) {
      setStory(campaignData.story);
      updateCampaign({ story: campaignData.story });
    }
  }, [campaignData?.title, campaignData?.story]);


  const handleNext = () => {
    if (!title || !story) {
      toast.error("Please add a title and story.");
      return;
    }
    navigate("/create/campaign/preview");
  };
  const handleStoryChange = (value) => {
    setStory(value);
    updateCampaign({ story: value });
  };



  return (
    <div className="min-h-screen flex bg-white text-gray-800">
      {/* Left Sidebar */}
      <div className="w-1/4 bg-gray-100 px-6  flex flex-col justify-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            AI-Powered Campaign Story
          </h1>
          <p className="text-gray-600 mb-6">
            Let our AI assistant help you craft a compelling narrative. Provide a title, then click the magic button to generate a first draft of your campaign story.
          </p>
          <div className="space-y-4 text-sm text-gray-600 bg-green-50 p-4 rounded-lg border border-green-200">
            <h2 className="font-semibold text-green-800">Prompting Tips:</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>A descriptive title gives the AI better context.</li>
              <li>You can edit the generated text at any time.</li>
              <li>Regenerate as many times as you need!</li>
            </ul>
          </div>
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
            <RichTextarea
              value={story}
              onChange={handleStoryChange}
              placeholder="Tell your story. Why are you raising funds? How will they be used?"
            />


          </div>
          <div className="flex items-center justify-between">
            <button
              onClick={handleGenerateStory}
              disabled={isGenerating}
              className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                '✨ Help Me Write'
              )}
            </button>
            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
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
