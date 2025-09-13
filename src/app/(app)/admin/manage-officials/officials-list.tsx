'use client';
import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { handleRemoveOfficial } from './actions';
import type { Official } from '@/lib/types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"


export function OfficialsList({ initialOfficials }: { initialOfficials: Official[] }) {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();

    const onRemove = (official: Official) => {
        startTransition(async () => {
            const result = await handleRemoveOfficial(official.id);
            if (result.success) {
                toast({
                    title: 'Official Removed',
                    description: `${official.name} has been de-authorized.`,
                });
            } else {
                toast({
                    title: 'Error',
                    description: result.error,
                    variant: 'destructive',
                });
            }
        });
    };

    if (!initialOfficials || initialOfficials.length === 0) {
        return <p className="text-sm text-muted-foreground">No officials have been added yet.</p>;
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {initialOfficials.map(official => (
                    <TableRow key={official.id}>
                        <TableCell className="font-medium">{official.name}</TableCell>
                        <TableCell>{official.email}</TableCell>
                        <TableCell className="text-right">
                             <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onRemove(official)}
                                disabled={isPending}
                                aria-label={`Remove ${official.name}`}
                            >
                                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-destructive" />}
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
