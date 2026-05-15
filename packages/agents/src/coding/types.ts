interface GeneratedPatch {
    filePath: string;
    patch: string;
    summary: string;
}

interface CoordinatedPatch {
    files: GeneratedPatch[];
    overallSummary: string;
}

type FileOperationType = "create_file" | "modify_file" | "delete_file" | "rename_file";

interface FileOperation {
    id: string;
    type: FileOperationType;
    filePath: string;
    purpose: string;
    dependsOn?: string[];
}

export {
    GeneratedPatch,
    CoordinatedPatch,
    FileOperationType,
    FileOperation
}