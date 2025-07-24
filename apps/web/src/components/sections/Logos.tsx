import { logos } from "../../utils/content";
import Image from "next/image";

export default function Logos() {
  return (
    <section className="bg-gradient-to-top">
      <div className="m-auto max-w-[90rem] px-24 py-28 max-xl:px-16 max-xl:py-24 max-lg:px-8 max-md:px-6">
        <p className="text-primary-50 last m-auto mb-20 text-center text-xl max-xl:text-lg/8 max-sm:mb-16">
          Employees in these companies use{" "}
          <span className="font-bold tracking-tight">OpenMemo</span>
        </p>
        <div className="flex flex-col gap-y-16 max-md:flex-row max-md:items-center max-md:justify-around max-sm:gap-x-14">
          <ul className="flex flex-wrap justify-between max-md:flex-col max-md:gap-y-16">
            {logos.slice(0, 4).map((logo) => {
              return (
                <li key={logo.id}>
                  <Image
                    width={158}
                    height={40}
                    className="h-10 max-xl:h-8 max-lg:h-7"
                    src={logo.src}
                    alt={logo.alt}
                    key={logo.id}
                  />
                </li>
              );
            })}
          </ul>
          <ul className="flex flex-wrap justify-between max-md:flex-col max-md:gap-y-16">
            {logos.slice(4).map((logo) => {
              return (
                <li key={logo.id}>
                  <Image
                    width={158}
                    height={40}
                    className="h-10 max-xl:h-8 max-lg:h-7"
                    src={logo.src}
                    alt={logo.alt}
                    key={logo.id}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
