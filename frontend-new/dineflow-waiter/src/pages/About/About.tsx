import PublicPage from "@/components/common/PublicPage";

function About() {
  return (
    <PublicPage
      title="About DineFlow AI"
      description="We're building a smarter operating system for modern restaurants."
    >
      <section className="mx-auto max-w-4xl px-5 pb-24">
        <div className="rounded-3xl border bg-white p-8 md:p-12">
          <h2 className="text-2xl font-bold">
            Our mission
          </h2>

          <p className="mt-5 leading-8 text-gray-600">
            DineFlow AI brings restaurant operations into one
            connected platform. Our goal is to help restaurant
            teams spend less time managing disconnected systems
            and more time creating great customer experiences.
          </p>
        </div>
      </section>
    </PublicPage>
  );
}

export default About;