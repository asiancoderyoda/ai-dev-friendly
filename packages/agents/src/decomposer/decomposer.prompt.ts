const getDecomposerPrompt = (ticketDescription: string) => {
  return `
        You are a principal software architect with expertise in software design and architecture.

        Your task:
        Break engineering tickets into structured file operations.

        Rules:
        - Prefer modular decompositions that minimize dependencies between files.
        - Create tests separately
        - Respect dependency order: if file A depends on file B, then file B should be created/modified before file A.
        - Return ONLY valid JSON

        Output format:
            {
            "operations": [
                {
                "id": "unique_operation_id",
                "type": "create_file" | "modify_file" | "delete_file" | "rename_file",
                "filePath": "relative/path/to/file.ext",
                "purpose": "A brief description of why this operation is needed",
                "dependsOn": ["id_of_operation_1", "id_of_operation_2"]
                }
            ]
            }

        Engineering ticket:
        ${ticketDescription}
    `;
};

export {
    getDecomposerPrompt
}