interface CloudProps {
  width?: number;
  className?: string;
  alt?: string;
}

export default function Cloud({ width = 1.5, className, alt }: CloudProps) {
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
        d="M5.54003 11.1201C0.860029 11.4501 0.860029 18.2601 5.54003 18.5901H7.46007"
        strokeWidth={width}
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.59003 11.1201C2.38003 2.19014 15.92 -1.37985 17.47 8.00015C21.8 8.55015 23.55 14.3201 20.27 17.1901C19.27 18.1001 17.98 18.6001 16.63 18.5901H16.54"
        strokeWidth={width}
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 16.5298C17 17.2698 16.84 17.9698 16.54 18.5898C16.46 18.7698 16.37 18.9398 16.27 19.0998C15.41 20.5498 13.82 21.5298 12 21.5298C10.18 21.5298 8.58998 20.5498 7.72998 19.0998C7.62998 18.9398 7.54002 18.7698 7.46002 18.5898C7.16002 17.9698 7 17.2698 7 16.5298C7 13.7698 9.24 11.5298 12 11.5298C14.76 11.5298 17 13.7698 17 16.5298Z"
        strokeWidth={width}
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.4399 16.5298L11.4299 17.5198L13.5599 15.5498"
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
