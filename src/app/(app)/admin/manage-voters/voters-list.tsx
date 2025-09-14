'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updateVoterStatus, removeVoter } from '@/app/(auth)/voter-actions';
import type { Voter } from '@/lib/types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from '@/components/ui/badge';


export function VotersList({ voters, listType }: { voters: Voter[], listType: Voter['status'] | 'approved' | 'rejected' }) {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();

    const handleUpdateStatus = (voterId: string, newStatus: 'approved' | 'rejected') => {
        startTransition(async () => {
            const result = await updateVoterStatus(voterId, newStatus);
            if (result.success) {
                toast({
                    title: 'Status Updated',
                    description: `Voter has been ${newStatus}.`,
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

    const handleRemove = (voterId: string, voterName: string) => {
        startTransition(async () => {
            const result = await removeVoter(voterId);
            if (result.success) {
                toast({
                    title: 'Voter Removed',
                    description: `${voterName} has been removed from the system.`,
                });
            } else {
                 toast({
                    title: 'Error',
                    description: result.error,
                    variant: 'destructive',
                });
            }
        });
    }

    if (!voters || voters.length === 0) {
        return <p className="text-sm text-center text-muted-foreground py-4">No voters in this category.</p>;
    }

    return (
        <div className="relative">
            {isPending && (
                <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10">
                    <Loader2 className="h-6 w-6 animate-spin" />
                </div>
            )}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>National ID</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {voters.map(voter => (
                        <TableRow key={voter.id}>
                            <TableCell className="font-medium">{voter.fullName}</TableCell>
                            <TableCell>{voter.nationalId}</TableCell>
                            <TableCell>{voter.email}</TableCell>
                            <TableCell className="text-right space-x-1">
                                {listType === 'pending' && (
                                    <>
                                        <Button variant="ghost" size="icon" onClick={() => handleUpdateStatus(voter.id, 'approved')} aria-label="Approve">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleUpdateStatus(voter.id, 'rejected')} aria-label="Reject">
                                            <XCircle className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </>
                                )}
                                {(listType === 'approved' || listType === 'rejected') && (
                                     <Button variant="ghost" size="icon" onClick={() => handleRemove(voter.id, voter.fullName)} aria-label="Remove">
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
