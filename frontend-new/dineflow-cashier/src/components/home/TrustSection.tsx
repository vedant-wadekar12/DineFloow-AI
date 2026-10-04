function TrustSection() {
  return (
    <section className="border-y bg-white py-12">
      <div className="mx-auto max-w-7xl px-5 text-center lg:px-8">
        <p className="text-sm font-medium text-gray-500">
          Built for modern restaurant teams
        </p>

        <div className="mt-8 grid grid-cols-2 gap-6 text-gray-400 sm:grid-cols-4 lg:grid-cols-6">
          {[
            "Restaurants",
            "Cafés",
            "Cloud Kitchens",
            "Food Courts",
            "Hotels",
            "QSRs",
          ].map((item) => (
            <div
              key={item}
              className="text-sm font-semibold"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrustSection;