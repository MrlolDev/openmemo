import Cloud from "../components/icons/Cloud";
import DollarCircle from "../components/icons/DollarCircle";
import Import from "../components/icons/Import";
import Integrate from "../components/icons/Integrate";
import MagicPen from "../components/icons/MagicPen";
import Note from "../components/icons/Note";
import Organization from "../components/icons/Organization";
import Search from "../components/icons/Search";
import TwoUsers from "../components/icons/TwoUsers";

const navigationLinks = [
  {
    id: 1,
    link: "Home",
    href: "#",
  },
  {
    id: 2,
    link: "Pricing",
    href: "#",
  },
  {
    id: 3,
    link: "About",
    href: "#",
  },
  {
    id: 4,
    link: "Community",
    href: "#",
  },
];

const logos = [
  {
    id: 1,
    src: "/logos/Netflix.webp",
    alt: "ChatGPT Logo",
  },
  {
    id: 2,
    src: "/logos/ExxonMobile.webp",
    alt: "T3-Chat Logo",
  },
  {
    id: 3,
    src: "/logos/Microsoft.webp",
    alt: "Claude Logo",
  },
  {
    id: 4,
    src: "/logos/Vice.webp",
    alt: "Gemini Logo",
  },
  {
    id: 5,
    src: "/logos/Walmart.webp",
    alt: "Perplexity Logo",
  },
  {
    id: 6,
    src: "/logos/Chase.webp",
    alt: "HuggingFace Logo",
  },
  {
    id: 7,
    src: "/logos/Visa.webp",
    alt: "Mistral Logo",
  },
  {
    id: 8,
    src: "/logos/Amazon.webp",
    alt: "Groq Logo",
  },
];

const frequentlyAskedQuestions = [
  {
    category: "General",
    id: 1,
    questions: [
      {
        id: 1,
        alt: "Note Icon",
        Icon: Note,
        question: "What is OpenMemo?",
        answer:
          "OpenMemo is a browser extension that creates a shared memory for all your AI applications. \
          It allows you to carry context and knowledge seamlessly between platforms like ChatGPT, Gemini, Claude, and more.",
      },
      {
        id: 2,
        alt: "Magic Pen Icon",
        Icon: MagicPen,
        question: "How does OpenMemo enhance my AI interactions?",
        answer:
          "OpenMemo stores your previous conversations and key information, allowing you to reference them in any supported AI chat. \
          This means you don't have to repeat yourself or lose context when switching between different AI tools, making your interactions more efficient and intelligent.",
      },
      {
        id: 3,
        alt: "Two Users Icon",
        Icon: TwoUsers,
        question: "Is OpenMemo a collaborative tool?",
        answer:
          "While currently focused on individual use, team collaboration features are on our roadmap. \
          Soon, you'll be able to share memories with your team to ensure everyone is on the same page when interacting with AI.",
      },
      {
        id: 4,
        alt: "Cloud Icon",
        Icon: Cloud,
        question: "Can I access my OpenMemo from multiple devices?",
        answer:
          "Yes, as a browser extension, OpenMemo syncs across any device where you are logged into your browser. \
          Your AI memory is always available, whether you're on your desktop, laptop, or tablet.",
      },
      {
        id: 5,
        alt: "Dollar Circle Icon",
        Icon: DollarCircle,
        question: "Is OpenMemo free?",
        answer:
          "Yes, OpenMemo is currently free to use. Our goal is to keep all core features accessible to everyone. As we grow and add more advanced capabilities, we may introduce optional premium plans in the future, but for now, enjoy the full power of OpenMemo at no cost.",
      },
    ],
  },
  {
    id: 3,
    category: "Features",
    questions: [
      {
        id: 9,
        alt: "Organization Icon",
        Icon: Organization,
        question: "How does The Smart Organization feature work?",
        answer:
          "OpenMemo's Smart Organization feature uses AI to automatically categorize and tag your memories \
          based on key topics and themes. This makes it easy to search and retrieve information from your past AI conversations.",
      },
      {
        id: 12,
        alt: "Search Icon",
        Icon: Search,
        question: "How does cross-platform memory work?",
        answer:
          "OpenMemo integrates with multiple AI platforms. Once you save a piece of information or a conversation, \
          you can recall it in any other supported AI chat. It's like having a universal brain for all your AI interactions.",
      },
    ],
  },
  {
    id: 4,
    category: "Integrations",
    questions: [
      {
        id: 13,
        alt: "Organization Icon",
        Icon: Organization,
        question: "What integrations does OpenMemo support?",
        answer:
          "We currently offer full support for ChatGPT, Claude, T3 Chat, DeepSeek, and Grok. \
          Support for Perplexity, Gemini, and Delphi is actively in development. \
          Additionally, we are committed to integrating all remaining platforms on the list, including Groq, Qwen, Kimi, Copilot, Poe, Le Chat, YouChat, Meta AI, HuggingChat, Pi, C.ai, Bing, and Replika. \
          These platforms are all high priority, and full support for each of them is planned.",
      },
      {
        id: 14,
        alt: "Integrate Icon",
        Icon: Integrate,
        question: "Will OpenMemo integrate with other apps in the future?",
        answer:
          "We are always working to expand our integration offerings. We frequently \
        update OpenMemo to support new and popular AI tools, so be sure to check back for new integrations.",
      },
      {
        id: 15,
        alt: "Import Icon",
        Icon: Import,
        question: "How can I get started with my own data?",
        answer:
          "You can import your existing memories from ChatGPT to get started right away. During onboarding, you also have the option to connect your X (Twitter) account. OpenMemo will analyze your tweets to create initial memories about who you are, your interests, and your style, giving your AI a head start on knowing you.",
      },
      {
        id: 16,
        alt: "Two Users Icon",
        Icon: TwoUsers,
        question: "Can multiple people use one OpenMemo account?",
        answer:
          "Soon, yes! We are developing a feature that will allow multiple memories within a single account, \
          so you can share an account while keeping your AI conversations separate and organized.",
      },
    ],
  },
];

const testimonials = [
  {
    id: 1,
    description:
      "OpenMemo has revolutionized my workflow. I can now switch between ChatGPT and Claude without losing any context. \
    It's like having a continuous conversation across all platforms.",
    name: "Emily Thompson",
    title: "AI Researcher at DeepMind",
  },
  {
    id: 2,
    description:
      "As a developer, I'm constantly using different AI tools. OpenMemo's shared memory is a game-changer. \
    No more copy-pasting conversations!",
    name: "Michael Carter",
    title: "Senior SWE at Google",
  },
  {
    id: 3,
    description:
      "I love how OpenMemo keeps my AI chats organized. The smart search feature helps me find information from past conversations instantly. \
    It's an essential tool for anyone who uses AI regularly.",
    name: "Sarah Lee",
    title: "Data Scientist at Netflix",
  },
  {
    id: 4,
    description:
      "The ability to maintain context across different AI models is incredibly powerful. \
    OpenMemo saves me so much time and frustration. A must-have extension!",
    name: "Jonathan Moore",
    title: "Product Manager at OpenAI",
  },
  {
    id: 5,
    description:
      "OpenMemo has made my interactions with AI so much more efficient. I can easily reference past information, \
    which leads to better and more accurate results from the AI.",
    name: "Rachel Foster",
    title: "Content Strategist at HubSpot",
  },
  {
    id: 6,
    description:
      "As a student, I use various AI tools for research. OpenMemo helps me keep all my findings in one place, \
    accessible from any AI chat. It's brilliant!",
    name: "Daniel Harris",
    title: "CS Student at Stanford",
  },
  {
    id: 7,
    description:
      "I’ve tried many productivity tools, but OpenMemo is unique. The concept of a shared AI memory is executed perfectly. \
    Highly recommended for all AI enthusiasts!",
    name: "Olivia Carter",
    title: "Tech Blogger at TechCrunch",
  },
  {
    id: 8,
    description:
      "The seamless integration with all major AI platforms is impressive. \
    OpenMemo has become an indispensable part of my daily toolkit.",
    name: "Thomas Williams",
    title: "UX/UI Designer at Apple",
  },
  {
    id: 9,
    description:
      "I rely heavily on AI for my work. OpenMemo's ability to recall information across different services \
    has made my workflow much smoother. It’s a fantastic productivity booster!",
    name: "Jessica Gonzalez",
    title: "Marketing Specialist at Meta",
  },
  {
    id: 10,
    description:
      "I can’t imagine going back to a world without OpenMemo. It's the missing link for a truly integrated \
    AI experience. The developers have created something special.",
    name: "Aaron Mitchell",
    title: "DevRel at Vercel",
  },
  {
    id: 11,
    description:
      "OpenMemo is a lifesaver for managing my AI-generated research. Everything is organized and searchable, \
    so I can focus on my work instead of managing conversations.",
    name: "Grace Stevens",
    title: "PhD Candidate at MIT",
  },
  {
    id: 12,
    description:
      "I'm always switching between different AI models to get the best results. OpenMemo makes this process seamless. \
    It's an essential tool for anyone serious about using AI.",
    name: "Ben Turner",
    title: "Freelance AI Consultant",
  },
  {
    id: 13,
    description:
      "With OpenMemo, I can keep track of all my AI interactions effortlessly. The cross-platform memory is a revolutionary feature. \
    It’s become an essential part of my daily routine.",
    name: "Katherine Evans",
    title: "Digital Strategist at IBM",
  },
  {
    id: 14,
    description:
      "As a CEO, efficiency is key. OpenMemo streamlines my use of AI, saving me time and ensuring I have all the information \
    I need at my fingertips, no matter which AI I'm using.",
    name: "Lucas King",
    title: "CEO at Scale AI",
  },
  {
    id: 15,
    description:
      "OpenMemo's ability to create a universal memory for my AI tools has been a huge boost to my creativity. \
    I can build on ideas across platforms without losing momentum. A must-have for any creative professional.",
    name: "Natalie James",
    title: "Graphics Engineer at NVIDIA",
  },
];

const footerCols = [
  {
    id: 1,
    category: "Home",
    links: ["FAQ", "Features", "Companies", "Testimonials"],
  },
  {
    id: 2,
    category: "Pricing",
    links: ["Plans", "Billing", "Free Trial", "Refunds"],
  },
  {
    id: 3,
    category: "About",
    links: ["Careers", "Our Story", "Contact", "Policy"],
  },
  {
    id: 4,
    category: "Community",
    links: ["Forum", "Stories", "Blog", "Support"],
  },
];

const features = {
  SmartOrganization: {
    alt: "Smart Organization graphic",
    heading: "Smart Organization",
    description:
      "Automatically categorize and tag your notes using AI-driven analysis. \
      OpenMemo intelligently identifies key topics and organizes your content, \
      making it easy to find and retrieve your notes when you need them most.",
  },
  ContextualReminders: {
    alt: "Contextual Reminders graphic",
    heading: "Contextual Reminders",
    description:
      "Stay on top of important tasks with AI-powered reminders that adapt to the \
      context of your notes. OpenMemo recognizes deadlines, follow-ups, and key actions \
      from your notes and sends timely alerts to ensure nothing slips through the cracks.",
  },
};

export {
  navigationLinks,
  logos,
  frequentlyAskedQuestions,
  testimonials,
  footerCols,
  features,
};
