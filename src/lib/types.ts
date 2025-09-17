export type Candidate = {
  id: string;
  name: string;
  party: string;
  platform: string;
  imageUrl: string;
};

export type Election = {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'Ongoing' | 'Upcoming' | 'Completed';
  candidates: Candidate[];
  imageUrl: string;
};

export type Official = {
  id: string;
  name: string;
  email: string;
};

export type UserRole = 'voter' | 'official' | 'admin';

export type Voter = {
  id: string; // This will be the Firebase Auth UID
  fullName: string;
  nationalId: string;
  email: string;
  password?: string; // Only used during registration, not stored in Firestore
  status: 'pending' | 'approved' | 'rejected';
  role: UserRole;
}
