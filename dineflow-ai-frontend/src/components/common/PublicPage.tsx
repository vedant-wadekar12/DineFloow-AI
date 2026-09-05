import type { ReactNode } from "react";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";

interface PublicPageProps {
  title: string;
  description: string;
  children?: ReactNode;
}

function PublicPage({
  title,
  description,
  children,
}: PublicPageProps) {
  return (
    <div className="min-h-screen bg-[#FFFDF8]">
      <Navbar />

      <main>
        <section className="px-5 py-24 text-center">
          <h1 className="text-5xl font-bold text-[#111827]">
            {title}
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-600">
            {description}
          </p>
        </section>

        {children}
      </main>

      <Footer />
    </div>
  );
}

export default PublicPage;