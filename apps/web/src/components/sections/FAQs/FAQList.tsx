"use client";
import { motion } from "framer-motion";
import { useState, ComponentType } from "react";
import FAQ from "./FAQ";

interface Question {
  id: number;
  alt: string;
  Icon: ComponentType<any>;
  question: string;
  answer: string;
}

interface FAQListProps {
  category: string;
  questions: Question[];
  activeQuestion: number | null;
  handleQuestionClick: (id: number) => void;
}

export default function FAQList({
  category,
  questions,
  activeQuestion,
  handleQuestionClick,
}: FAQListProps) {
  const [inView, setInView] = useState(false);

  return (
    <motion.ul
      className="m-auto flex max-w-[51.625rem] flex-col gap-y-14 max-lg:gap-y-12"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      key={category}
      layout
      variants={{
        hidden: {
          opacity: 0,
        },
        visible: {
          transition: {
            staggerChildren: 0.25,
            ease: "easeIn",
          },
        },
      }}
      onViewportEnter={() => setInView(true)}
      onViewportLeave={() => setInView(false)}
    >
      {questions.map((question) => (
        <FAQ
          key={question.id}
          question={question}
          activeQuestion={activeQuestion}
          handleQuestionClick={handleQuestionClick}
        />
      ))}
    </motion.ul>
  );
}
