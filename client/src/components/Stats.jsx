function Stats() {
  return (
    <section className="bg-blue-600 text-white py-20 mt-20">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 text-center gap-10">

        <div>
          <h1 className="text-5xl font-bold">1000+</h1>
          <p className="mt-3">Students</p>
        </div>

        <div>
          <h1 className="text-5xl font-bold">500+</h1>
          <p className="mt-3">Notes Shared</p>
        </div>

        <div>
          <h1 className="text-5xl font-bold">250+</h1>
          <p className="mt-3">Marketplace Listings</p>
        </div>

        <div>
          <h1 className="text-5xl font-bold">100+</h1>
          <p className="mt-3">Placements</p>
        </div>

      </div>
    </section>
  );
}

export default Stats;