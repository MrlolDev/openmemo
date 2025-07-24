import Logo from "../icons/Logo";
import { navigationLinks } from "../../utils/content";

export default function Navigation() {
  return (
    <nav className="text-primary-50 m-auto flex max-w-[90rem] justify-between px-24 text-lg/8 font-light max-xl:px-16 max-xl:text-base/loose max-lg:px-8 max-md:px-6">
      <a
        className="flex items-center gap-x-3 max-xl:gap-x-3 max-md:gap-x-2"
        href="#"
      >
        <Logo className="h-8 max-md:h-7" alt="OpenMemo Logo Icon" />
        <p className="text-xl font-bold tracking-tight max-xl:text-xl max-md:text-lg/8 max-md:tracking-tighter">
          OpenMemo
        </p>
      </a>

      <ul className="flex items-center gap-x-8 max-xl:gap-x-6 max-lg:hidden">
        {navigationLinks.map((link) => (
          <li key={link.id}>
            <a
              href={link.href}
              className="hover:text-primary-500 transition-properties"
            >
              {link.link}
            </a>
          </li>
        ))}
      </ul>

      <div className="flex items-center max-lg:hidden">
        <button className="bg-primary-500 border-primary-500 text-primary-1300 primary-glow hover:border-primary-50 hover:bg-primary-50 primary-glow-hover transition-properties cursor-pointer rounded-full border-2 px-6 py-2.5 text-base font-normal max-xl:px-5 max-xl:py-2 max-xl:text-sm">
          Get Started
        </button>
      </div>
    </nav>
  );
}
