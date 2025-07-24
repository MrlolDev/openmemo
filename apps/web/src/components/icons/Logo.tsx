import Image from "next/image";

interface LogoProps {
  className?: string;
  alt?: string;
}

export default function Logo({ className, alt }: LogoProps) {
  return (
    <Image
      src={"/logo.png"}
      width={100}
      height={100}
      alt={alt || "Logo"}
      className={className}
    />
  );
}
