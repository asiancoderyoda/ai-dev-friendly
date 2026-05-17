import { z } from "zod";

export const FileOperationSchema = z.object({
  id: z.string().describe("A unique slug or identifier for this operation step, e.g., 'create_auth_service'"),
  type: z.enum(["create_file", "modify_file", "delete_file", "rename_file"]),
  filePath: z.string().describe("Relative path to the target file from the repository root, e.g., 'src/services/auth.service.ts'"),
  purpose: z.string().describe("Explicit detailed reasoning for why this file change is mandatory"),
  dependsOn: z.array(z.string()).describe("List of operation IDs that must execute completely before this step can begin. Leave empty if no prerequisite changes exist.")
});

export const DecomposerResponseSchema = z.object({
  operations: z.array(FileOperationSchema)
});

export type FileOperation = z.infer<typeof FileOperationSchema>;
export type DecomposerResponse = z.infer<typeof DecomposerResponseSchema>;