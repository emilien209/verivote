export type Candidate = {
  id: string;
  name: string;
  party: string;
  platform: string;
  imageUrl: string;
  imageHint: string;
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
