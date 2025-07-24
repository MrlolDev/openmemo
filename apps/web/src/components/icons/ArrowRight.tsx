interface ArrowRightProps {
  width?: number;
  className?: string;
  alt?: string;
}

export default function ArrowRight({
  width = 1.5,
  className,
  alt,
}: ArrowRightProps) {
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
        d="M8.91 19.797L15.43 13.277C16.2 12.507 16.2 11.247 15.43 10.477L8.91 3.95703"
        strokeWidth={width}
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
