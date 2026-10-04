const testimonials = [
  {
    quote:
      "DineFlow gives our team one place to manage the entire restaurant operation.",
    name: "Restaurant Owner",
    role: "Multi-location Restaurant",
  },
  {
    quote:
      "The QR ordering workflow makes the customer experience much faster.",
    name: "Operations Manager",
    role: "Casual Dining",
  },
  {
    quote:
      "Having orders, kitchen operations and analytics connected is a huge advantage.",
    name: "Restaurant Manager",
    role: "Food & Beverage",
  },
];

function Testimonials() {
  return (
    <section className="bg-[#FFFDF8] py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="text-center">
          <p className="font-semibold text-[#FF6B35]">
            CUSTOMER STORIES
          </p>

          <h2 className="mt-3 text-4xl font-bold text-[#111827] sm:text-5xl">
            Built around restaurant teams.
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <div
              key={item.name}
              className="rounded-2xl border bg-white p-7"
            >
              <div className="text-2xl text-[#FFB703]">
                “
              </div>

              <p className="mt-3 leading-7 text-gray-600">
                {item.quote}
              </p>

              <div className="mt-6 border-t pt-5">
                <p className="font-semibold">
                  {item.name}
                </p>

                <p className="text-sm text-gray-500">
                  {item.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;