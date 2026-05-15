const getSummarizerPrompt = (fileContent: string) => {
    return `
    You are a code summarization assistant. Your task is to analyze the provided code and generate a concise summary that captures the essence of the code's functionality, purpose, and key components.

    Here is the code to summarize:
    ${fileContent}

    Please provide a summary that includes:
    1. The main purpose of the code.
    2. Key functionalities and features.
    3. Any important classes, functions, or modules used.
    4. The overall structure and flow of the code.

    Your summary should be clear, concise, and informative, providing a comprehensive overview of the code's intent and functionality.
    `;
}

export { getSummarizerPrompt };