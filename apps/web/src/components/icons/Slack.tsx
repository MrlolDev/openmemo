interface SlackProps {
  width?: number;
  className?: string;
  alt?: string;
}

export default function Slack({ width = 1.5, className, alt }: SlackProps) {
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
        d="M14.5 2.2998C13.5 2.2998 12.6 3.0998 12.6 4.1998V8.7998C12.6 9.7998 13.4 10.6998 14.5 10.6998C15.5 10.6998 16.4 9.8998 16.4 8.7998V4.0998C16.4 3.0998 15.6 2.2998 14.5 2.2998Z"
        strokeWidth={width}
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.6 10.5999H20.2C21.1 10.5999 21.8 9.8999 21.8 8.9999C21.8 8.0999 21.1 7.3999 20.2 7.3999C19.3 7.3999 18.6 8.0999 18.6 8.9999V10.5999Z"
        strokeWidth={width}
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 9.1998C2 10.1998 2.8 11.0998 3.9 11.0998H8.5C9.5 11.0998 10.4 10.2998 10.4 9.1998C10.4 8.1998 9.6 7.2998 8.5 7.2998H3.9C2.8 7.3998 2 8.1998 2 9.1998Z"
        strokeWidth={width}
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.4 5.1V3.6C10.4 2.7 9.69995 2 8.79995 2C7.89995 2 7.19995 2.7 7.19995 3.6C7.19995 4.5 7.89995 5.2 8.79995 5.2H10.4V5.1Z"
        strokeWidth={width}
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.4 21.7999C10.4 21.7999 11.3 20.9999 11.3 19.8999V15.2999C11.3 14.2999 10.5 13.3999 9.4 13.3999C8.4 13.3999 7.5 14.1999 7.5 15.2999V19.8999C7.6 20.8999 8.4 21.7999 9.4 21.7999Z"
        strokeWidth={width}
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.39995 13.3999H3.79995C2.89995 13.3999 2.19995 14.0999 2.19995 14.9999C2.19995 15.8999 2.89995 16.5999 3.79995 16.5999C4.69995 16.5999 5.39995 15.8999 5.39995 14.9999V13.3999Z"
        strokeWidth={width}
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 14.7999C22 13.7999 21.2 12.8999 20.1 12.8999H15.5C14.5 12.8999 13.6 13.6999 13.6 14.7999C13.6 15.7999 14.4 16.6999 15.5 16.6999H20.1C21.1 16.6999 22 15.7999 22 14.7999Z"
        strokeWidth={width}
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.6 18.7998V20.3998C13.6 21.2998 14.3 21.9998 15.2 21.9998C16.1 21.9998 16.8 21.2998 16.8 20.3998C16.8 19.4998 16.1 18.7998 15.2 18.7998H13.6Z"
        strokeWidth={width}
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
