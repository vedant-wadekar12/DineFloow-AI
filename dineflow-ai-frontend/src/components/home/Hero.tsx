import { ArrowRight, Play, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#FFFDF8]">
      <div className="absolute left-1/2 top-0 h-100 w-100 -translate-x-1/2 rounded-full bg-[#FFB703]/15 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-20 lg:px-8 lg:pb-28 lg:pt-28">
        <div className="mx-auto max-w-4xl text-center">
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm shadow-sm"
          >
            <Sparkles className="h-4 w-4 text-[#FF6B35]" />
            <span>AI-powered restaurant operations</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-bold tracking-tight text-[#111827] sm:text-6xl lg:text-7xl"
          >
            Run your restaurant
            <span className="block text-[#FF6B35]">
              smarter with AI.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600"
          >
            DineFlow AI brings ordering, kitchen operations,
            staff management, billing, analytics and AI-powered
            insights into one intelligent restaurant platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"
          >
            <Button
              size="lg"
              className="bg-[#FF6B35] px-7 hover:bg-[#e85d2d]"
              render={<Link to="/register" />}
            >
              <Link to="/register">
                Start Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button size="lg" variant="outline">
              <Play className="mr-2 h-4 w-4" />
              See how it works
            </Button>
          </motion.div>

          <p className="mt-4 text-sm text-gray-500">
            No credit card required.
          </p>
        </div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mx-auto mt-16 max-w-6xl"
        >
          <div className="rounded-2xl border bg-white p-2 shadow-2xl">
            <div className="rounded-xl border bg-gray-50 p-5">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                
                {[
                  ["Today's Revenue", "₹84,250", "+18.2%"],
                  ["Orders", "1,284", "+12.5%"],
                  ["Customers", "892", "+8.4%"],
                  ["Avg. Order", "₹656", "+6.8%"],
                ].map(([title, value, change]) => (
                  <div
                    key={title}
                    className="rounded-xl border bg-white p-5"
                  >
                    <p className="text-sm text-gray-500">
                      {title}
                    </p>

                    <p className="mt-2 text-2xl font-bold text-[#111827]">
                      {value}
                    </p>

                    <p className="mt-1 text-sm text-[#06D6A0]">
                      {change}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 h-56 rounded-xl border bg-white p-5">
                <p className="font-semibold">
                  Revenue Overview
                </p>

                <div className="mt-8 flex h-32 items-end gap-3">
                  {[45, 65, 50, 80, 62, 90, 76, 100, 82, 95, 72, 88].map(
                    (height, index) => (
                      <div
                        key={index}
                        className="flex-1 rounded-t-md bg-[#FF6B35]/80"
                        style={{ height: `${height}%` }}
                      />
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;