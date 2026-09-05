import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

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

        <Button 
          size="lg"
          className="mt-8 bg-white text-[#111827] hover:bg-gray-100"
          render={<Link to="/register" />}
        >
          <Link to="/register">
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

export default CTASection;