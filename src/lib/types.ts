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
};

export type Official = {
  id: string;
  name: string;
  email: string;
};

export type Voter = {
  id: string;
  fullName: string;
  nationalId: string;
  email: string;
  password?: string; // Password should not be sent to client
  status: 'pending' | 'approved' | 'rejected';
}
