
export const AIPrompt = ({ title }) => {
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
        
        Make sure the story is engaging, clear, and formatted correctly for a rich text editor. The final output should be a well-structured HTML string that can be rendered directly in a React component.
        Also don't write the title like HOOK, CALL TO ACTION, etc. Just write the content in a way that it can be rendered by a rich text editor.
    
`;

    return promptText;
};
