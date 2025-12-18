import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How is ReSearchly different from a chatbot?",
    answer: "Unlike chatbots that generate responses from training data, ReSearchly retrieves information from verified sources, fact-checks each finding, and provides transparent citations. Every answer is grounded in real, attributable sources rather than AI-generated content.",
  },
  {
    question: "How does it reduce hallucinations?",
    answer: "ReSearchly uses retrieval-augmented generation (RAG) to ground all responses in actual documents. Each claim is cross-referenced against multiple sources, and findings are only presented when they meet our verification threshold. This approach significantly reduces the fabrication of facts.",
  },
  {
    question: "Can I trust the sources used?",
    answer: "Yes. Every source is evaluated for credibility, recency, and relevance. We prioritize peer-reviewed publications, established institutions, and verified professional sources. You can always inspect the original source for any finding.",
  },
  {
    question: "What does the Trust Score represent?",
    answer: "The Trust Score is an AI-assigned reliability metric (0-100%) based on source authority, publication recency, cross-validation with other sources, and domain expertise. Higher scores indicate stronger confidence in the finding's accuracy.",
  },
  {
    question: "Who is it built for?",
    answer: "ReSearchly is designed for researchers, students, analysts, and writers who need reliable, well-sourced information. Whether you're writing a thesis, conducting market research, or fact-checking claims, ReSearchly provides the rigor you need.",
  },
  {
    question: "Is my research private?",
    answer: "Absolutely. Your research sessions are private by default, stored securely, and never shared with third parties. You own your research data, and you can export or delete it at any time.",
  },
  {
    question: "Can I export or cite my work?",
    answer: "Yes. ReSearchly supports one-click citation exports in APA, IEEE, and MLA formats. You can also export your full report with all sources and findings for use in papers, presentations, or further analysis.",
  },
  {
    question: "Is it free to use?",
    answer: "ReSearchly offers a free tier for exploring the platform. Premium features including advanced synthesis, unlimited research depth, and priority source access are available through our subscription plans.",
  },
];

const FAQSection = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to know about ReSearchly
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="glass-card border-glass-border/50 rounded-xl px-6 data-[state=open]:border-primary/30"
            >
              <AccordionTrigger className="text-left font-medium hover:text-primary hover:no-underline py-5">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
