import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function FAQ() {
  return (
    <section className="bg-[#FFFDF8] py-24">
      <div className="mx-auto max-w-3xl px-5 lg:px-8">
        <div className="text-center">
          <p className="font-semibold text-[#FF6B35]">
            FAQ
          </p>

          <h2 className="mt-3 text-4xl font-bold text-[#111827]">
            Frequently asked questions
          </h2>
        </div>

        <Accordion
          className="mt-12"
        >
          <AccordionItem value="item-1">
            <AccordionTrigger>
              What is DineFlow AI?
            </AccordionTrigger>

            <AccordionContent>
              DineFlow AI is a restaurant operating system that
              connects ordering, kitchen operations, staff,
              billing, analytics and AI insights.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>
              Can I manage multiple restaurants?
            </AccordionTrigger>

            <AccordionContent>
              Yes. DineFlow is designed as a multi-tenant platform
              with support for restaurants and branches.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>
              Does DineFlow support QR ordering?
            </AccordionTrigger>

            <AccordionContent>
              Yes. Each table can have a unique QR code that opens
              the restaurant's digital ordering experience.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>
              Does it include analytics?
            </AccordionTrigger>

            <AccordionContent>
              Yes. Restaurant operators can view revenue, orders,
              customer activity and other business metrics.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}

export default FAQ;