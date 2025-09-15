
export type MockOfficial = {
    id: string;
    name: string;
    email: string;
    password?: string;
};

// In a real app, this data would be in a database.
// This is the initial seed data for the JSON file store.
export const MOCK_OFFICIALS: MockOfficial[] = [];
