import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 140 32"
        className="h-8 w-auto text-primary"
        aria-hidden="true"
      >
        <g fill="currentColor">
          {/* Icon */}
          <path
            d="M27.3,0.2H4.7C2.3,0.2,0.2,2.3,0.2,4.7v22.5c0,2.5,2.1,4.5,4.5,4.5h22.5c2.5,0,4.5-2.1,4.5-4.5V4.7 C31.8,2.3,29.8,0.2,27.3,0.2z M13.4,22.9l-6.8-6.8l2.2-2.2l4.6,4.6l9.8-9.8l2.2,2.2L13.4,22.9z"
          />
          {/* VeriVote Text */}
          <text
            x="38"
            y="23"
            fontSize="24"
            fontFamily="'PT Sans', sans-serif"
            fontWeight="bold"
            fill="currentColor"
            className="text-foreground"
          >
            VeriVote
          </text>
        </g>
      </svg>
      <span className="sr-only">VeriVote</span>
    </div>
  );
}
