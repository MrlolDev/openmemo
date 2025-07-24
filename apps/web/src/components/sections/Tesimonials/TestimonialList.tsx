"use client";
import { motion } from "framer-motion";
import Testimonal from "./Testimonal";

interface Testimonial {
  id: number;
  description: string;
  name: string;
  title: string;
}

interface TestimonialListProps {
  testimonials: Testimonial[];
}

export default function TestimonialList({
  testimonials,
}: TestimonialListProps) {
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <div className="w-full overflow-hidden">
      <motion.ul
        className="flex gap-x-6"
        initial={{ x: 0 }}
        animate={{ x: "-100%" }}
        transition={{
          duration: 40,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {duplicatedTestimonials.map((test, index) => (
          <li key={index} className="flex-shrink-0" style={{ width: "33%" }}>
            <Testimonal test={test} />
          </li>
        ))}
      </motion.ul>
    </div>
  );
}
