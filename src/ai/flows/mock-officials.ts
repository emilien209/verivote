export type MockOfficial = {
    id: string;
    name: string;
    email: string;
    password?: string;
};

// In a real app, you would not want to commit this data.
// This is for demonstration purposes only.
export let MOCK_OFFICIALS: MockOfficial[] = [
    { id: 'off1', name: 'Emile N.', email: 'emile@verivote.gov', password: 'password123' },
    { id: 'off2', name: 'Aline U.', email: 'aline@verivote.gov', password: 'password456' },
];
