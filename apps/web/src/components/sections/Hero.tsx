import ArrowRight from "../icons/ArrowRight";
import ArrowRightLine from "../icons/ArrowRightLine";
import Image from "next/image";

export default function Hero() {
  return (
    <div className="m-auto grid max-w-[90rem] grid-cols-[5fr_4fr] items-center gap-x-18 px-24 py-42 max-xl:grid-cols-2 max-xl:gap-x-12 max-xl:px-16 max-xl:py-38 max-lg:px-8 max-lg:py-32 max-md:grid-cols-1 max-md:grid-rows-[repeat(2,auto)] max-md:gap-y-12 max-md:px-6 max-md:py-24">
      <div>
        <h1 className="text-primary-50 mb-6 text-6xl/18 font-semibold tracking-tighter max-xl:mb-4 max-xl:text-5xl/16 max-lg:text-4xl/10 max-lg:tracking-tight max-sm:text-3xl/9 max-sm:tracking-tighter">
          Your AI's Perfect Memory. Never Lose Context Again.
        </h1>
        <p className="text-primary-100 mb-10 text-xl/loose font-light max-xl:mb-8 max-xl:text-lg/8 max-lg:text-base/loose">
          OpenMemo gives your AI a long-term memory, <br />
          so you can pick up conversations where you left off, across any
          platform.
        </p>
        <button className="text-primary-1300 bg-primary-500 border-primary-500 hover:border-primary-50 hover:bg-primary-50 transition-properties primary-glow-hover primary-glow group flex cursor-pointer items-center gap-x-3 rounded-full border-2 px-6 py-2.5 max-xl:gap-x-2 max-xl:px-5 max-xl:py-2">
          <p className="text-base max-xl:text-sm">Get Started</p>
          <div className="w-5 max-xl:w-4 max-sm:hidden">
            <ArrowRightLine
              alt="Arrow right line"
              className="stroke-primary-1300 transition-properties -mr-3 inline w-0 opacity-0 ease-in-out group-hover:w-3 group-hover:opacity-100"
              width={2.5}
            />
            <ArrowRight
              alt="Arrow right icon"
              className="stroke-primary-1300 inline w-5 max-xl:w-4"
              width={2}
            />
          </div>
        </button>
      </div>
      <div className="relative">
        <div className="bg-primary-1300 absolute top-0 right-0 bottom-0 left-0 rounded-full blur-3xl" />
        <Image
          src={"/mockup.png"}
          width={750}
          height={750}
          alt="Hero graphic of an Iphone showing OpenMemo's cross-platform memory"
          className="relative max-h-[30rem] justify-self-end max-md:max-h-auto max-md:max-w-[90%] max-md:justify-self-center max-sm:max-w-full"
        />
      </div>
    </div>
  );
}
