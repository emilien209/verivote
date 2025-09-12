import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Election } from '@/lib/types';
import { ArrowRight } from 'lucide-react';

const elections: Omit<Election, 'candidates'>[] = [
  {
    id: 'presidential-2024',
    title: 'Presidential Election 2024',
    description: 'Vote for the next president to lead the nation for the upcoming term.',
    startDate: '2024-10-01',
    endDate: '2024-10-15',
    status: 'Ongoing',
  },
  {
    id: 'parliamentary-2024',
    title: 'Parliamentary Elections',
    description: 'Elect your representatives for the national parliament.',
    startDate: '2024-11-05',
    endDate: '2024-11-10',
    status: 'Upcoming',
  },
    {
    id: 'local-gov-2025',
    title: 'Local Government Elections',
    description: 'Choose your local council members and mayors.',
    startDate: '2025-02-20',
    endDate: '2025-02-22',
    status: 'Upcoming',
  },
];

export default function DashboardPage() {
  const ongoingElections = elections.filter(e => e.status === 'Ongoing');

  return (
    <div className="grid flex-1 items-start gap-4 md:gap-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here are the elections you can participate in.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {ongoingElections.length > 0 ? (
          ongoingElections.map((election) => (
            <Card key={election.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{election.title}</CardTitle>
                  <Badge variant={election.status === 'Ongoing' ? 'destructive' : 'secondary'}>{election.status}</Badge>
                </div>
                <CardDescription>{election.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Voting Period: {new Date(election.startDate).toLocaleDateString()} - {new Date(election.endDate).toLocaleDateString()}
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link href={`/elections/${election.id}`}>Vote Now <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p>No ongoing elections at the moment.</p>
        )}
      </div>

       <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Upcoming Elections</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {elections.filter(e => e.status === 'Upcoming').map((election) => (
             <Card key={election.id} className="opacity-70">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{election.title}</CardTitle>
                  <Badge variant="secondary">{election.status}</Badge>
                </div>
                <CardDescription>{election.description}</CardDescription>
              </CardHeader>
              <CardContent>
                 <p className="text-sm text-muted-foreground">
                  Starts: {new Date(election.startDate).toLocaleDateString()}
                </p>
              </CardContent>
              <CardFooter>
                <Button disabled className="w-full">
                  Voting Starts Soon
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
