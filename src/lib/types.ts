export type Candidate = {
  id: string;
  name: string;
  party: string;
  platform: string;
};

export type Election = {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'Ongoing' | 'Upcoming' | 'Completed';
  candidates: Candidate[];
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
  email: string;
  role: UserRole;
  status: 'pending' | 'approved' | 'rejected';
  
  // Optional fields based on registration type
  nationalId?: string;
  phone?: string;
  idPhotoUrl?: string;
}

export type Vote = {
  id: string; // composite key voterId_electionId
  voterId: string;
  electionId: string;
  candidateId: string;
  candidateName: string;
  votedAt: Date;
}

export type VoteCount = {
  candidateId: string;
  candidateName: string;
  votes: number;
  fill?: string;
}
