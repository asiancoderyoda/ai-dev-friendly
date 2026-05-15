import fs from 'fs';
class TicketLoader {
    static loadTicket(ticketPath: string): string {
        try {
            const ticketContent = fs.readFileSync(ticketPath, 'utf-8');
            return ticketContent;
        } catch (error) {
            console.error(`Error loading ticket from ${ticketPath}:`, error);
            throw error;
        }
    }
}

export default TicketLoader;