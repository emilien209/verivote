export type MockOfficial = {
    id: string;
    name: string;
    email: string;
    password?: string;
};

// This mock data is no longer used. Officials are now managed in Firestore.
export const MOCK_OFFICIALS: MockOfficial[] = [];
