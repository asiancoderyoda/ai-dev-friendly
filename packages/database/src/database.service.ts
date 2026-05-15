import { AppDataSource } from "./datasource";

class DatabaseService {
    constructor() {

    }

    async initialize() {
        try {
            if (!AppDataSource.isInitialized) {
                await AppDataSource.initialize();
                console.log("Database connection established successfully.");
            }
            return AppDataSource;
        } catch (error) {
            console.error("Error during database initialization:", error);
            throw error;
        }
    }
    
}

export default DatabaseService;