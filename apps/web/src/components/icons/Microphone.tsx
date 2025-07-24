interface MicrophoneProps {
  width?: number;
  className?: string;
  alt?: string;
}

export default function Microphone({
  width = 1.5,
  className,
  alt,
}: MicrophoneProps) {
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
        d="M12 19C15.31 19 18 16.31 18 13V8C18 4.69 15.31 2 12 2C8.69 2 6 4.69 6 8V13C6 16.31 8.69 19 12 19Z"
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 11V13C3 17.97 7.03 22 12 22C16.97 22 21 17.97 21 13V11"
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.10999 7.48018C10.89 6.83018 12.83 6.83018 14.61 7.48018"
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.03 10.4799C11.23 10.1499 12.5 10.1499 13.7 10.4799"
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
