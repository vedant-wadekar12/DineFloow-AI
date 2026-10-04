import { CheckCircle2, QrCode, ShoppingCart, ChefHat, Receipt } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: QrCode,
    title: "Customer scans QR",
    description:
      "A unique table QR code opens the restaurant's digital menu.",
  },
  {
    number: "02",
    icon: ShoppingCart,
    title: "Customer orders",
    description:
      "Customers browse, customize items and place their order.",
  },
  {
    number: "03",
    icon: ChefHat,
    title: "Kitchen prepares",
    description:
      "The kitchen receives the order instantly and starts preparation.",
  },
  {
    number: "04",
    icon: Receipt,
    title: "Order completes",
    description:
      "Billing, payment and feedback complete the customer journey.",
  },
];

function WorkflowSection() {
  return (
    <section className="bg-[#FFFDF8] py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="text-center">
          <p className="font-semibold text-[#FF6B35]">
            HOW IT WORKS
          </p>

          <h2 className="mt-3 text-4xl font-bold text-[#111827] sm:text-5xl">
            From table to kitchen, seamlessly.
          </h2>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div key={step.number} className="relative">
                <span className="text-sm font-bold text-[#FF6B35]">
                  {step.number}
                </span>

                <div className="mt-4 flex h-14 w-14 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
                  <Icon className="h-6 w-6 text-[#FF6B35]" />
                </div>

                <h3 className="mt-5 text-xl font-semibold">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  {step.description}
                </p>

                <CheckCircle2 className="mt-5 h-5 w-5 text-[#06D6A0]" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default WorkflowSection;