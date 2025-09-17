import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getVoters } from '@/app/(auth)/voter-actions';
import { VotersList } from './voters-list';


export const revalidate = 0; // Make this page dynamic

export default async function ManageVotersPage() {
  const voters = await getVoters();

  const pending = voters.filter(v => v.status === 'pending');
  const approved = voters.filter(v => v.status === 'approved');
  const rejected = voters.filter(v => v.status === 'rejected');

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Voters</h1>
        <p className="text-muted-foreground">
          Approve, reject, or remove voter registrations.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-1">
        <Card>
           <CardHeader>
            <CardTitle>Pending Registrations</CardTitle>
            <CardDescription>Review and act on new voter registrations.</CardDescription>
          </CardHeader>
          <CardContent>
            <VotersList voters={pending} listType="pending" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Approved Voters</CardTitle>
             <CardDescription>Voters who are authorized to participate in elections.</CardDescription>
          </CardHeader>
          <CardContent>
            <VotersList voters={approved} listType="approved" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rejected / Removed Voters</CardTitle>
            <CardDescription>Voters who are not authorized to participate.</CardDescription>
          </CardHeader>
          <CardContent>
            <VotersList voters={rejected} listType="rejected" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
