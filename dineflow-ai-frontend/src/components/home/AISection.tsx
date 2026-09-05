import { BrainCircuit, Lightbulb, Sparkles, TrendingUp } from "lucide-react";

function AISection() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-2 lg:items-center lg:px-8">
        
        <div>
          <p className="font-semibold text-[#FF6B35]">
            DINEFLOW AI
          </p>

          <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#111827] sm:text-5xl">
            Turn restaurant data into smarter decisions.
          </h2>

          <p className="mt-5 text-lg leading-8 text-gray-600">
            DineFlow AI analyzes restaurant activity and helps
            operators understand what's happening, identify
            opportunities and make better decisions.
          </p>

          <div className="mt-8 space-y-5">
            {[
              [
                TrendingUp,
                "Sales insights",
                "Understand revenue and order trends.",
              ],
              [
                Lightbulb,
                "Smart recommendations",
                "Discover opportunities hidden in your data.",
              ],
              [
                Sparkles,
                "Menu intelligence",
                "Understand which menu items perform best.",
              ],
            ].map(([Icon, title, description]) => {
              const IconComponent = Icon as typeof TrendingUp;

              return (
                <div
                  key={title as string}
                  className="flex gap-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#FF6B35]/10">
                    <IconComponent className="h-5 w-5 text-[#FF6B35]" />
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      {title as string}
                    </h3>

                    <p className="mt-1 text-sm text-gray-600">
                      {description as string}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl bg-[#111827] p-6 shadow-2xl">
          <div className="rounded-2xl bg-white p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF6B35]/10">
                <BrainCircuit className="h-5 w-5 text-[#FF6B35]" />
              </div>

              <div>
                <p className="font-semibold">
                  DineFlow AI Insight
                </p>

                <p className="text-xs text-gray-500">
                  Just now
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-[#FFFDF8] p-5">
              <p className="text-sm leading-6 text-gray-700">
                Weekend dinner orders are trending 18% higher
                than last month. Consider increasing preparation
                capacity for your top-selling dishes.
              </p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="rounded-xl border p-4">
                <p className="text-xs text-gray-500">
                  Revenue trend
                </p>
                <p className="mt-1 text-xl font-bold">
                  +18.2%
                </p>
              </div>

              <div className="rounded-xl border p-4">
                <p className="text-xs text-gray-500">
                  Orders trend
                </p>
                <p className="mt-1 text-xl font-bold">
                  +12.5%
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default AISection;