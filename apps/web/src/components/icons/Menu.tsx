interface MenuProps {
  width?: number;
  className?: string;
  alt?: string;
}

export default function Menu({ width = 1.5, className, alt }: MenuProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {alt && <title>{alt}</title>}
      <path
        d="M4.99988 10.0001H6.99988C8.99988 10.0001 9.99988 9.00006 9.99988 7.00006V5.00006C9.99988 3.00006 8.99988 2.00006 6.99988 2.00006H4.99988C2.99988 2.00006 1.99988 3.00006 1.99988 5.00006V7.00006C1.99988 9.00006 2.99988 10.0001 4.99988 10.0001Z"
        strokeWidth={width}
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.9999 10.0001H18.9999C20.9999 10.0001 21.9999 9.00006 21.9999 7.00006V5.00006C21.9999 3.00006 20.9999 2.00006 18.9999 2.00006H16.9999C14.9999 2.00006 13.9999 3.00006 13.9999 5.00006V7.00006C13.9999 9.00006 14.9999 10.0001 16.9999 10.0001Z"
        strokeWidth={width}
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.9999 22H18.9999C20.9999 22 21.9999 21 21.9999 19V17C21.9999 15 20.9999 14 18.9999 14H16.9999C14.9999 14 13.9999 15 13.9999 17V19C13.9999 21 14.9999 22 16.9999 22Z"
        strokeWidth={width}
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.99988 22H6.99988C8.99988 22 9.99988 21 9.99988 19V17C9.99988 15 8.99988 14 6.99988 14H4.99988C2.99988 14 1.99988 15 1.99988 17V19C1.99988 21 2.99988 22 4.99988 22Z"
        strokeWidth={width}
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
