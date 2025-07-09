import React from 'react';
import RichTextarea from './ui/RichTextarea';

// Main App Component for the Crowdfunding Page
export default function TestComponent() {
    // State for the campaign title and story
    const [title, setTitle] = React.useState('');
    const [story, setStory] = React.useState('');

    // State to manage the AI generation process
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [error, setError] = React.useState(null);

    const handleGenerateStory = async () => {

        if (isGenerating) return;
        setIsGenerating(true);
        setError(null);
        setStory(''); // Clear previous story


        const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || "";

        if (apiKey === "") {
            setError("Please add your OpenRouter API key to the code.");
            setIsGenerating(false);
            return;
        }

        // 2. --- Construct the Prompt for the AI ---
        // A more detailed prompt yields better results.
        const promptText = `
            Please generate a compelling and emotionally engaging crowdfunding story using rich text formatting (such as <h1>, <h2>, <p>, <strong>, <em>, <ul>, <ol>), which will be rendered by a custom React-based rich text editor.
Context:

    Campaign Title: ${title || 'Untitled Campaign'}

    This title will serve as the main focus of the story. Base the narrative on what this title represents.

Structure the story into three parts:

    Hook (Beginning):

        Start with a short and impactful introduction (<h2> or <p>).

        Use emotion or urgency to grab the reader's attention.

    Details (Middle):

        Use <h3> and <p> tags to structure the mission clearly.

        Explain:

            The core mission (why this matters).

            The problem you're solving.

            The impact your campaign will create.

        Use bullet points (<ul>) or numbered lists (<ol>) if needed to break down the use of funds transparently.

    Call to Action (End):

        Conclude with a direct, inspiring appeal.

        Encourage people to donate, support, and share the campaign.

        Make the final paragraph emotionally charged and hopeful.

Style Guidelines:

    Use semantic HTML: <h1>, <h2>, <h3>, <p>, <strong>, <em>, <ul>, <ol>, etc.

    Avoid inline styles or custom classes.

    The tone should be inspiring, heartfelt, and easy to understand.
    `;

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
                                    setStory(prevStory => prevStory + content);
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

    return (
        <div className="min-h-screen font-sans flex bg-gray-50 text-gray-800">
            {/* Left Sidebar for context and guidance */}
            <div className="w-full md:w-1/3 bg-white p-8 border-r border-gray-200 flex flex-col justify-center">
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

            {/* Right Content Area for editing */}
            <div className="w-full md:w-2/3 p-8 flex flex-col justify-center">
                <div className="max-w-2xl w-full mx-auto">
                    {/* Title Input */}
                    <div className="mb-8">
                        <label htmlFor="campaignTitle" className="block mb-2 text-lg font-bold text-gray-700">
                            Campaign Title
                        </label>
                        <input
                            id="campaignTitle"
                            type="text"
                            placeholder="e.g., 'Eco-Friendly Community Garden for All'"
                            className="border border-gray-300 focus:ring-2 focus:ring-green-500 p-4 rounded-lg w-full text-base placeholder-gray-400 transition-shadow duration-200"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    {/* Story Textarea */}
                    <div className="relative mb-4">
                        <label htmlFor="campaignStory" className="block mb-2 text-lg font-bold text-gray-700">
                            Campaign Story
                        </label>
                        <RichTextarea
                            value={story}
                            onChange={(newValue) => {
                                setStory(newValue);           // Update local state
                                // Update context/store/backend
                            }}
                            placeholder="Tell your story. Why are you raising funds? How will they be used?"

                        />

                    </div>

                    {/* Action Button */}
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
            </div>
        </div>
    );
}
