"use client";

import { FiInfo, FiEdit3, FiLock, FiMapPin, FiHelpCircle } from 'react-icons/fi';
import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  category: string;
  icon: React.ComponentType;  
  items: FAQItem[];
}

interface FAQAccordionProps {
  items: FAQItem[];
  category: string;
  icon: React.ComponentType;   
}

const FAQAccordion: React.FC<FAQAccordionProps> = ({ items, category, icon: Icon }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="mb-10 bg-[#f7f9fc]">
      <div className="flex items-center justify-center md:justify-start gap-3 mb-5">
        <span className="text-3xl text-primary">
          <Icon />
        </span>
        <h2 className="text-2xl font-bold text-foreground text-center md:text-left break-words">
          {category}
        </h2>
      </div>

      {items.map((item, index) => (
        <div
          key={index}
          className="mb-3 bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
        >
          <button
            onClick={() => toggleItem(index)}
            className="w-full p-4 flex justify-between items-center text-left"
            aria-expanded={openIndex === index}
          >
            <span className="font-semibold text-card-foreground pr-4 break-words">
              {item.question}
            </span>

            <span className="text-xl text-primary transition-transform duration-300 flex-shrink-0">
              {openIndex === index ? "−" : "+"}
            </span>
          </button>

          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              openIndex === index ? "max-h-40 p-4 pt-0" : "max-h-0 p-0"
            }`}
          >
            <p className="text-muted-foreground leading-relaxed break-words">
              {item.answer}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

const FAQ = () => {
  const faqs: FAQCategory[] = [
    {
      category: "General",
      icon: FiInfo,
      items: [
        { question: "What is CUBECHARM?", answer: "CUBECHARM is a social real estate platform for exploring, publishing, and sharing properties with 360-degree viewing." },
        { question: "Who can use CUBECHARM?", answer: "Anyone interested in real estate agents, developers, or individuals can join to explore or publish properties." },
        { question: "How do I create an account?", answer: "Click 'Sign Up', enter your info, verify your email, and start using CUBECHARM." },
      ],
    },
    {
      category: "Publishing",
      icon: FiEdit3,
      items: [
        { question: "How do I publish a property?", answer: "Go to 'Create Post', upload images or 360-degree tours, add details, and publish." },
        { question: "How long to approve my post?", answer: "Posts are reviewed and approved within minutes if they meet our standards." },
        { question: "Why might my post be rejected?", answer: "Rejections happen due to misleading images, duplicates, or non-compliance with our policies." },
      ],
    },
    {
      category: "Privacy",
      icon: FiLock,
      items: [
        { question: "How is my data protected?", answer: "We use encryption and secure protocols to protect your data." },
        { question: "Can I delete my account?", answer: "Yes, manage your account settings or contact support to delete it." },
        { question: "Is my data shared?", answer: "No, your data isn't shared without consent, per our Privacy Policy." },
      ],
    },
    {
      category: "Locations",
      icon: FiMapPin,
      items: [
        { question: "Where is CUBECHARM available?", answer: "Currently in Egypt (Cairo, Mansoura, Alexandria, New Capital), with plans to expand." },
        { question: "Can I use it outside Egypt?", answer: "Yes, CUBECHARM is accessible globally online." },
        { question: "Do listings vary by region?", answer: "Yes, each region has unique verified listings and agents." },
      ],
    },
    {
      category: "Help & Support",
      icon: FiHelpCircle,
      items: [
        { question: "Where do I start?", answer: "Visit our Help Center for guides on using CUBECHARM." },
        { question: "How to contact support?", answer: "Use the 'Contact Us' page for email or live support." },
        { question: "Question not answered?", answer: "Contact our support team for further assistance." },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-4 md:p-6 bg-[#f7f9fc]">
      <div className="max-w-5xl mx-auto bg-card rounded-3xl shadow-lg p-6 md:p-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-10 text-foreground">
          Frequently Asked Questions
        </h1>

        {faqs.map((faq, index) => (
          <FAQAccordion
            key={index}
            items={faq.items}
            category={faq.category}
            icon={faq.icon}
          />
        ))}
      </div>
    </div>
  );
};

export default FAQ;
