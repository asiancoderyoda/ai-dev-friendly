// const getDecomposerPrompt = (ticketDescription: string) => {
//   return `
//         You are a principal software architect with expertise in software design and architecture.

//         Your task:
//         Break engineering tickets into structured file operations.

//         Rules:
//         - Prefer modular decompositions that minimize dependencies between files.
//         - Create tests separately
//         - Respect dependency order: if file A depends on file B, then file B should be created/modified before file A.
//         - Return ONLY valid JSON

//         Output format:
//             {
//             "operations": [
//                 {
//                 "id": "unique_operation_id",
//                 "type": "create_file" | "modify_file" | "delete_file" | "rename_file",
//                 "filePath": "relative/path/to/file.ext",
//                 "purpose": "A brief description of why this operation is needed",
//                 "dependsOn": ["id_of_operation_1", "id_of_operation_2"]
//                 }
//             ]
//             }

//         Engineering ticket:
//         ${ticketDescription}
//     `;
// };

// export {
//     getDecomposerPrompt
// }

export const getDecomposerPrompt = (ticketDescription: string, context: any): string => {
    return `
        You are a Principal Software Architect specializing in system decomposition, topological dependency ordering, and software graph generation.

        Your task is to analyze the provided engineering ticket and break it down into an ordered sequence of discrete, atomic file operations.

        GRAPH CONSTRAINTS & RULES:
        1. **Dependency Integrity**: If File A imports, references, or relies on an interface, export, layout, or utility from File B, then File B MUST be created or modified first. Therefore, the operation for File A must list the operation ID for File B in its "dependsOn" array.
        2. **Directed Acyclic Graph (DAG) Safety**: You must ensure the execution graph contains no circular dependencies. No two operations may depend on each other mutually, and no operation can depend on itself.
        3. **Test Isolation**: Always separate test code generation (e.g., unit or integration test files) into their own distinct operational steps. These test steps must explicitly depend on the core implementation operations they are testing.
        4. **Deterministic Paths**: Every "filePath" property must be relative to the repository root. Always use exact, standard UNIX-style forward slashes (/) for directories (e.g., "src/components/Button.tsx" or "server/routes/api.js"). Do not use backward slashes or absolute system boundaries.
        5. **Granularity**: Keep changes tightly scoped. Prefer breaking a large multi-file change into multiple small, modular operations rather than clumping distinct architectural actions into a single large operation block.

        ENGINEERING TICKET TO DECOMPOSE:
        "${ticketDescription}"

        RETRIEVED REPOSITORY CONTEXT & CODEBASE METADATA:
        Use this context to identify exactly which files need modifications, which files need to be created, and how their imports depend on each other:
        ${JSON.stringify(context, null, 2)}

        Analyze the target requirements and generate the structured file operations graph now.
    `;
};