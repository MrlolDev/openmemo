interface Testimonial {
  id: number;
  description: string;
  name: string;
  title: string;
}

interface TestimonalProps {
  test: Testimonial;
}

export default function Testimonal({ test }: TestimonalProps) {
  return (
    <div className="bg-primary-1300 flex h-full flex-col justify-between rounded-2xl px-8 py-10 max-xl:px-6 max-md:py-8">
      <p className="text-primary-50 pb-16 text-lg/loose font-light max-xl:text-base/loose max-md:pb-12">
        {test.description}
      </p>
      <div>
        <p className="text-primary-500 text-xl/7 font-bold tracking-tight max-xl:text-lg/8">
          {test.name}
        </p>
        <p className="text-primary-75 text-base/loose tracking-tight max-xl:text-sm">
          {test.title}
        </p>
      </div>
    </div>
  );
}
