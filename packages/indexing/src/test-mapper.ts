class TestMapper {
    constructor() {

    }

    /**
     * Currently, this method maps test files to their corresponding source files based on naming conventions.
     * For example, if there is a file named `example.ts`, it will look for `example.test.ts` or `example.spec.ts` as its test files.
     */
    mapTestFiles(files: string[]): Record<string, string[]> {
        const mappedFiles: Record<string, string[]> = {};
        
        files.forEach(file => {
            if (file.endsWith('.test.ts') || file.endsWith('.spec.ts')) {
                const sourceFile = file.replace('.test.ts', '.ts').replace('.spec.ts', '.ts');
                if (!mappedFiles[sourceFile]) {
                    mappedFiles[sourceFile] = [];
                }
                mappedFiles[sourceFile].push(file);
            }
        });

        return mappedFiles;
    }
}

export default TestMapper;