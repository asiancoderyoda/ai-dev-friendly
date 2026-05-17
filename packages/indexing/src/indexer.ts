import { Project, SyntaxKind, VariableDeclaration, FunctionDeclaration, ClassDeclaration, SourceFile } from 'ts-morph';
import { IndexedSymbol } from '@letscode-dev-friendly/shared';

class RepositoryIndexer {
    private project: Project;

    constructor(repositoryPath: string) {
        this.project = new Project({
            tsConfigFilePath: `${repositoryPath}/tsconfig.json`,
            compilerOptions: {
                allowJs: true,
                jsx: 1
            }
        });

        this.project.addSourceFilesAtPaths([
            `${repositoryPath}/**/*.{ts,tsx,js,jsx,css,html,json}`,
            // `!${repositoryPath}/**/node_modules/**`,
            // `!${repositoryPath}/**/dist/**`,
            // `!${repositoryPath}/**/.next/**`
        ]);
    }

    /**
     * Optional helper to turn package.json dependencies into searchable strings
     */
    private extractDependencies(file: SourceFile): string[] {
        try {
            const content = JSON.parse(file.getFullText());
            const deps = Object.keys(content.dependencies || {});
            const devDeps = Object.keys(content.devDependencies || {});
            return [...deps, ...devDeps]; // Returns array of package names like ['react', 'lodash']
        } catch {
            return []; // Fail-safe for malformed JSON
        }
    }

    public async indexRepository(): Promise<IndexedSymbol[]> {
        const sourceFiles = this.project.getSourceFiles();
        const symbols: IndexedSymbol[] = [];

        for (const file of sourceFiles) {
            const filePath = file.getFilePath();
            const extension = file.getExtension();
            const baseName = file.getBaseName();

            console.log(`Indexing file: ${filePath} with extension: ${extension}`);

            /**
             * 1. Handle JSON configuration files (e.g., package.json, tsconfig.json)
             */
            if (extension === '.json') {
                symbols.push({
                    name: baseName,
                    type: 'configuration',
                    filePath,
                    imports: [],
                    // Optional: Parse the JSON to grab specific things like dependencies
                    // so your vector index knows exactly what packages are installed
                    exports: baseName === 'package.json' ? this.extractDependencies(file) : []
                });
                continue;
            }

            /**
             * 2. Handle Static Asset files (CSS / HTML layouts)
             */
            if (extension === '.css' || extension === '.html') {
                symbols.push({
                    name: file.getBaseName(),
                    type: extension === '.css' ? 'stylesheet' : 'html-document',
                    filePath,
                    imports: [],
                    exports: []
                });
                continue;
            }

            // Extract shared imports/exports safely once per file
            const imports = file.getImportDeclarations().map(imp => imp.getModuleSpecifierValue());
            const exports = file.getExportSymbols().map(exp => exp.getName());

            /**
             * 3. Parse Object-Oriented Structures
             */
            file.getClasses().forEach((cls: ClassDeclaration) => {
                symbols.push({
                    name: cls.getName() || 'AnonymousClass',
                    type: 'class',
                    filePath,
                    imports,
                    exports
                });
            });

            /**
             * 4. Parse Named Functions
             */
            file.getFunctions().forEach((func: FunctionDeclaration) => {
                symbols.push({
                    name: func.getName() || 'AnonymousFunction',
                    type: 'function',
                    filePath,
                    imports,
                    exports
                });
            });

            /**
             * 5. Advanced: Extract Modern React Arrow-Function Components & Hooks
             */
            file.getVariableDeclarations().forEach((vDec: VariableDeclaration) => {
                const initializer = vDec.getInitializer();
                if (!initializer) return;

                // Check if the variable is assigned to an arrow function or normal function expression
                const isFunctionLike =
                    initializer.getKind() === SyntaxKind.ArrowFunction ||
                    initializer.getKind() === SyntaxKind.FunctionExpression;

                if (isFunctionLike) {
                    const name = vDec.getName();
                    // Basic heuristic: React components/hooks start with capital letters or "use"
                    const isComponentOrHook = /^[A-Z]|^use[A-Z]/.test(name);

                    symbols.push({
                        name,
                        type: isComponentOrHook ? 'component' : 'function',
                        filePath,
                        imports,
                        exports
                    });
                }
            });
        }

        return symbols;
    }
}

export default RepositoryIndexer;