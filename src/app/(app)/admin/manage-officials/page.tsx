import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getOfficials } from '@/ai/flows/manage-officials';
import { OfficialsList } from './officials-list';
import { AddOfficialForm } from './add-official-form';


export default async function ManageOfficialsPage() {
  // Fetching officials on the server to ensure the list is up-to-date on page load.
  const initialOfficials = await getOfficials();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Election Officials</h1>
        <p className="text-muted-foreground">
          Authorize or remove officials responsible for conducting the voting process.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Current Officials</CardTitle>
            <CardDescription>A list of all authorized election officials.</CardDescription>
          </CardHeader>
          <CardContent>
            <OfficialsList initialOfficials={initialOfficials} />
          </CardContent>
        </Card>
        <Card>
           <CardHeader>
            <CardTitle>Add New Official</CardTitle>
            <CardDescription>Enter the details to authorize a new official.</CardDescription>
          </CardHeader>
          <CardContent>
            <AddOfficialForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
