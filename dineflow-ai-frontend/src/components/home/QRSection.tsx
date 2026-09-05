import { QrCode, Smartphone } from "lucide-react";

function QRSection() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-[#111827] p-8 text-white md:p-12 lg:p-16">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF6B35]">
                <QrCode className="h-6 w-6" />
              </div>

              <h2 className="mt-6 text-4xl font-bold sm:text-5xl">
                Turn every table into a digital ordering point.
              </h2>

              <p className="mt-5 leading-7 text-gray-400">
                Give customers a faster way to browse your menu,
                customize dishes and place orders directly from
                their table.
              </p>
            </div>

            <div className="flex justify-center">
              <div className="rounded-3xl bg-white p-8">
                <div className="flex h-48 w-48 items-center justify-center rounded-xl border-4 border-[#111827]">
                  <QrCode className="h-36 w-36 text-[#111827]" />
                </div>

                <div className="mt-5 flex items-center justify-center gap-3 text-[#111827]">
                  <Smartphone className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    Scan • Order • Enjoy
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default QRSection;