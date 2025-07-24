import { ReactNode } from "react";

interface HeaderProps {
  children: ReactNode;
}

export default function Header({ children }: HeaderProps) {
  return (
    <header className="bg-gradient-to-bottom py-10 max-xl:py-8 max-lg:pb-24 max-md:pt-6 max-md:pb-24">
      {children}
    </header>
  );
}
