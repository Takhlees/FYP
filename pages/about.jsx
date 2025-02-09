"use client";
// import Navbar from '@components/Navbar'
// import Footer from '@components/Footer'

// export default function About() {
//   return (
//     <div className="flex flex-col min-h-screen">
//       <Navbar />
//       <main className="flex-grow max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//         <div className="px-4 py-6 sm:px-0">
//           <h1 className="text-3xl font-bold text-gray-900">About Us</h1>
          
//         </div>
//       </main>
//       <Footer />
//     </div>
//   )
// }
"use client";
import { useState } from "react";
import { MailIcon, ShieldIcon, UsersIcon, TrendingUpIcon, CheckCircleIcon, ArrowRightIcon, PlusIcon, MinusIcon } from "lucide-react";
import Navbar from "@components/Navbar"; // Assuming you have a Navbar component
import Footer from "@components/Footer"; // Assuming you have a Footer component

export default function AboutPage() {
  const [activeFeature, setActiveFeature] = useState("smart");
  const [openFAQ, setOpenFAQ] = useState(null);

  const features = {
    smart: {
      title: "Smart Categorization",
      description:
        "Our AI-powered system automatically organizes your inbox, saving you hours each week.",
      benefits: ["Reduce email overwhelm", "Focus on high-priority messages", "Never miss important emails"],
    },
    search: {
      title: "Lightning-Fast Search",
      description:
        "Find any email or attachment in milliseconds with our advanced search capabilities.",
      benefits: ["Instant information retrieval", "Search within attachments", "Natural language queries"],
    },
    automation: {
      title: "Powerful Automation",
      description:
        "Create custom workflows that handle repetitive tasks automatically.",
      benefits: ["Streamline your workflow", "Reduce human error", "Increase productivity"],
    },
    collaboration: {
      title: "Seamless Collaboration",
      description: "Work together effortlessly with shared inboxes and team features.",
      benefits: ["Improve team communication", "Delegate tasks easily", "Maintain accountability"],
    },
  };

  const faqs = [
    {
      question: "How secure is your Mail Management System?",
      answer:
        "We prioritize your data security. Our system uses end-to-end encryption, two-factor authentication, and regular security audits to ensure your emails and personal information remain protected at all times.",
    },
    {
      question: "Can I integrate with other tools I use?",
      answer:
        "Our Mail Management System seamlessly integrates with popular productivity tools, CRMs, and project management software. This ensures that your email communication fits perfectly into your existing workflow.",
    },
    {
      question: "Is it suitable for both individuals and teams?",
      answer:
        "Yes, our system is designed to scale from individual users to large teams. Whether you're a freelancer managing your own inbox or part of a large organization with complex communication needs, our features adapt to your requirements.",
    },
    {
      question: "How does the AI-powered categorization work?",
      answer:
        "Our AI analyzes the content, sender, and context of your emails to automatically sort them into relevant categories. It learns from your behavior over time, continuously improving its accuracy. You can also customize the categories and rules to fit your specific needs.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <Navbar /> {/* Navbar component */}

      <header className="bg-sky-600 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Revolutionize Your Inbox</h1>
          <p className="text-xl text-sky-100">Experience the future of email management</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Why Choose Our System Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-sky-800 mb-6">
            Why Choose Our Mail Management System?
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            In today's fast-paced digital world, email overload is a real problem. Our system is designed to give you back control of your inbox, boost your productivity, and reduce stress.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(features).map(([key, feature]) => (
              <div
                key={key}
                className={`cursor-pointer transition-all p-6 rounded-lg ${
                  activeFeature === key ? "bg-sky-100 shadow-lg" : "bg-white hover:shadow-md"
                }`}
                onClick={() => setActiveFeature(key)}
              >
                <h3 className="text-2xl font-semibold text-sky-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Frequently Asked Questions Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-sky-800 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-4">
                <button
                  className="flex justify-between items-center w-full text-left"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={openFAQ === index}
                >
                  <h3 className="text-xl font-semibold text-sky-700">{faq.question}</h3>
                  {openFAQ === index ? (
                    <MinusIcon className="h-6 w-6 text-sky-600" />
                  ) : (
                    <PlusIcon className="h-6 w-6 text-sky-600" />
                  )}
                </button>
                {openFAQ === index && (
                  <p className="text-gray-600 mt-2 transition-all">{faq.answer}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="text-center mb-16">
          <h2 className="text-3xl font-semibold text-sky-800 mb-6">
            Ready to Transform Your Email Experience?
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            Join thousands of satisfied users who have reclaimed control of their inboxes and boosted their productivity.
          </p>
          <a
            href="/home"
            className="inline-flex items-center px-6 py-3 text-lg font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors"
          >
            Start Your Free Trial
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </a>
        </section>
      </main>

      <Footer /> {/* Footer component */}
    </div>
  );
}


