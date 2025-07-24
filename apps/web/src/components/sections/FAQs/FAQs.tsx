"use client";
import { useState } from "react";
import { frequentlyAskedQuestions } from "../../../utils/content";
import FAQList from "./FAQList";

export default function FAQs() {
  const [category, setActiveCategory] = useState("General");
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);

  const categoryObj = frequentlyAskedQuestions.find(
    (obj) => obj.category === category
  );
  const questionsArr = categoryObj ? categoryObj.questions : [];

  const handleQuestionClick = (id: number) =>
    id === activeQuestion ? setActiveQuestion(null) : setActiveQuestion(id);

  const handleCategoryClick = (category: string) => {
    setActiveQuestion(null);
    setActiveCategory(category);
  };

  return (
    <section className="bg-gradient-to-bottom justify-items-center">
      <div className="w-full max-w-[90rem] py-32 max-xl:px-16 max-xl:py-24 max-lg:px-8 max-md:px-6">
        <h2 className="text-primary-50 mb-8 text-center text-6xl/18 font-semibold tracking-tighter max-xl:mb-6 max-xl:text-5xl/16 max-lg:text-4xl/10 max-lg:tracking-tight max-md:mb-4 max-md:text-left max-sm:text-3xl/9 max-sm:tracking-tighter">
          Frequently Asked Questions
        </h2>
        <div className="mb-8 text-xl/loose font-light max-lg:text-lg/8 max-sm:text-base/loose">
          <p className="text-primary-100 text-center max-md:text-left max-sm:hidden">
            The most commonly asked questions about OpenMemo.{" "}
            <br className="max-md:hidden" />
            Have any other questions?{" "}
            <a
              href="mailto:support@openmemo.app"
              className="group underline decoration-1 underline-offset-3"
            >
              Chat with us
            </a>
          </p>
        </div>
        <ul className="mb-16 flex flex-wrap justify-center gap-x-3 gap-y-4 max-lg:mb-18 max-md:justify-start">
          {frequentlyAskedQuestions.map((obj) => (
            <li key={obj.id}>
              <button
                className={`border-primary-50 text-primary-50 transition-properties cursor-pointer rounded-full border-2 px-7 py-2.5 text-base/loose max-xl:px-6 max-xl:py-2 max-sm:py-2.5 ${
                  obj.category === category &&
                  "bg-primary-500 text-primary-1300 border-primary-500 primary-glow"
                } ${
                  obj.category !== category &&
                  "hover:bg-primary-50 hover:text-primary-1300"
                }`}
                onClick={() => handleCategoryClick(obj.category)}
              >
                {obj.category}
              </button>
            </li>
          ))}
        </ul>
        <FAQList
          category={category}
          questions={questionsArr}
          activeQuestion={activeQuestion}
          handleQuestionClick={handleQuestionClick}
        />
      </div>
    </section>
  );
}
