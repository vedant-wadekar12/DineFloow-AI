import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

function CTASection() {
  return (
    <section className="bg-[#FF6B35] py-20">
      <div className="mx-auto max-w-4xl px-5 text-center text-white lg:px-8">
        <Sparkles className="mx-auto h-10 w-10" />

        <h2 className="mt-6 text-4xl font-bold sm:text-5xl">
          Ready to run your restaurant smarter?
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-lg text-white/80">
          Bring your restaurant operations together with
          DineFlow AI.
        </p>

        <Link
          to="/register"
          className="mt-8 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-white px-6 text-sm font-semibold text-[#111827] shadow-sm transition hover:bg-gray-100"
        >
          Get Started
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

export default CTASection;