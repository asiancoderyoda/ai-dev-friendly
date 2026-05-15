import { execSync } from "child_process";


class ValidationService {
    runValidation(repoPath: string): boolean {
        try {
            execSync("npm run lint", { cwd: repoPath, stdio: "inherit" });
            execSync("npm run typecheck", { cwd: repoPath, stdio: "inherit" });
            return true;
        } catch (e) {
            console.error("Error occurred while running validation:", e);
            return false;
        }
    }
}

export default ValidationService;