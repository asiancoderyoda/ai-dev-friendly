import { FileOperation } from "../decomposer";

export const getFileGenerationPrompt = (
    taskDescription: string,
    operation: FileOperation,
    context: any,
    currentFileContents?: string
): string => {
    let fileStatePrompt = "";

    if (currentFileContents) {
        fileStatePrompt = `
            CURRENT FILE STATE ON DISK:
            This file already exists. You MUST preserve all existing capabilities, exports, and unrelated functions. Modify only what is requested.
            \`\`\`
            ${currentFileContents}
            \`\`\`
        `;
    } else {
        fileStatePrompt = `
            NEW FILE TARGET:
            This file does not exist yet. Create a complete, production-grade module from scratch. Do not output truncated structures or placeholders like '// implement later'.
        `;
    }

    return `
        You are a Principal Full-Stack Engineer writing highly optimized, clean, and production-ready Node.js code.

        TARGET SPECIFICATIONS:
        - File Target Path: ${operation.filePath}
        - Action Strategy Type: ${operation.type}
        - Intended Functional Purpose: ${operation.purpose}

        ${fileStatePrompt}

        GLOBAL REPOSITORY CONTEXT MAPPINGS:
        Use this to align dependencies, imports, styles, or patterns with the rest of the application:
        ${JSON.stringify(context, null, 2)}

        ORIGINAL ENGINEERING TICKET OBJECTIVE:
        "${taskDescription}"

        EXECUTION INSTRUCTIONS:
        1. Ensure strict typing if targeting a TypeScript extension (.ts/.tsx).
        2. Adhere to SOLID principles and keep component/function interfaces highly clean.
        3. Include inline code documentation only for complex blocks.
        4. Output your generation cleanly into the specified 'content' structural response properties.
    `;
};