import { GuideForm } from './guide-form';

export default function GuidePage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Election Guide</h1>
        <p className="text-muted-foreground">
          Ask anything about election rules and voting procedures.
        </p>
      </div>
      <GuideForm />
    </div>
  );
}
