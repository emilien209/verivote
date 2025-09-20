import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Vote, Users, Percent } from 'lucide-react';
import { AdminCharts } from './charts';
import { getDashboardStats } from './actions';

export const revalidate = 10; // Revalidate every 10 seconds

export default async function AdminPage() {
  const stats = await getDashboardStats();
  const turnout = stats.totalVoters > 0 ? (stats.votesCast / stats.totalVoters) * 100 : 0;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Real-time monitoring of the Presidential Election 2024.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Voters</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVoters.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total registered citizens
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Votes Cast</CardTitle>
            <Vote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.votesCast.toLocaleString()}</div>
             <p className="text-xs text-muted-foreground">
              Live vote count
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Voter Turnout</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{turnout.toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">
              Current participation rate
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Results by Candidate</CardTitle>
            <CardDescription>Live vote count for each candidate.</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.results.length > 0 ? (
              <AdminCharts resultsData={stats.results} />
            ) : (
               <p className="text-center text-muted-foreground">No votes have been cast yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
