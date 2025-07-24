interface CloseProps {
  width?: number;
  className?: string;
  alt?: string;
}

export default function Close({ width = 1.5, className, alt }: CloseProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {alt && <title>{alt}</title>}
      <path
        d="M6 18L18 6"
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 18L6 6"
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
