export type MockOfficial = {
    id: string;
    name: string;
    email: string;
    password?: string;
};

// In a real app, this data would be in a database.
// This is the initial seed data for the JSON file store.
export const MOCK_OFFICIALS: MockOfficial[] = [
    { id: 'off1', name: 'Emile N.', email: 'emile@verivote.gov', password: 'password123' },
    { id: 'off2', name: 'Aline U.', email: 'aline@verivote.gov', password: 'password456' },
];
