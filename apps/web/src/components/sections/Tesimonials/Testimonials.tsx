import { testimonials as test } from "../../../utils/content";
import TestimonialList from "./TestimonialList";

export default function Testimonials() {
  return (
    <section className="bg-gradient-to-top">
      <div className="m-auto flex max-w-[90rem] flex-col items-center px-24 py-32 max-xl:px-16 max-xl:py-24 max-lg:px-8 max-md:px-6">
        <div className="mb-20 flex max-w-[51.625rem] flex-col items-center gap-y-6 max-lg:mb-18 max-lg:gap-y-0">
          <p className="text-primary-1300 bg-primary-500 primary-glow w-min rounded-full px-4 py-2 text-base/8 max-lg:mb-8">
            Testimonials
          </p>
          <h2 className="text-primary-50 text-center text-6xl/18 font-semibold tracking-tighter max-xl:text-5xl/16 max-lg:mb-4 max-lg:text-4xl/10 max-lg:tracking-tight max-sm:text-3xl/9 max-sm:tracking-tighter">
            What our community says <br />
            about OpenMemo
          </h2>
          <p className="text-primary-100 px-28 text-center text-xl/loose font-light max-lg:text-lg/8 max-md:px-4">
            OpenMemo has helped 1000&apos;s supercharge their productivity with
            our cutting edge AI memory tool
          </p>
        </div>
        <div className="w-full">
          <TestimonialList testimonials={test} />
        </div>
      </div>
    </section>
  );
}
