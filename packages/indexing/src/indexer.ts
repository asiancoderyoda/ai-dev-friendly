import { Project } from 'ts-morph';
import { IndexedSymbol } from '@letscode-dev-friendly/shared';

class RepositoryIndexer {
    private project: Project;
    constructor(repositoryPath: string) {
        this.project = new Project({
            tsConfigFilePath: `${repositoryPath}/tsconfig.json`,
        });
    }

    public indexRepository() {
        const sourceFiles = this.project.getSourceFiles();
        const symbols: IndexedSymbol[] = [];
        sourceFiles.forEach(file => {
            const imports = file.getImportDeclarations().map(imp => imp.getModuleSpecifierValue());
            const exports = file.getExportSymbols().map(exp => exp.getName());
            const classes = file.getClasses();
            const functions = file.getFunctions();
            classes.forEach(cls => {
                symbols.push({
                    name: cls.getName() || 'UnnamedClass',
                    type: 'class',
                    filePath: file.getFilePath(),
                    imports,
                    exports,
                });
            });
            functions.forEach(func => {
                symbols.push({
                    name: func.getName() || 'UnnamedFunction',
                    type: 'function',
                    filePath: file.getFilePath(),
                    imports,
                    exports,
                });
            });
        });
        return symbols;
    }
}

export default RepositoryIndexer;