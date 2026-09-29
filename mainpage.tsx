import QuoteForm from "@/components/QuoteForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">

      {/* Navigation Bar */}
      <nav className="flex items-center justify-between border-b bg-white px-6 py-4 md:px-12">

        {/* Logo */}
        <div className="text-2xl font-bold text-green-600">
          SolarPower
        </div>

        {/* Navigation Links */}
        <div className="hidden items-center gap-8 md:flex">
          <a href="#" className="text-gray-700 hover:text-green-600">
            Home
          </a>

          <a href="#" className="text-gray-700 hover:text-green-600">
            About
          </a>

          <a href="#" className="text-gray-700 hover:text-green-600">
            Services
          </a>

          <a href="#" className="text-gray-700 hover:text-green-600">
            Projects
          </a>

          <a href="#" className="text-gray-700 hover:text-green-600">
            Contact
          </a>
        </div>

        {/* Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <button className="rounded-lg border border-green-600 px-4 py-2 font-semibold text-green-600 hover:bg-green-50">
            Login
          </button>

          <button className="rounded-lg bg-green-600 px-5 py-2 font-semibold text-white hover:bg-green-700">
            Get Quote
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex min-h-[85vh] flex-col items-center justify-center px-6 text-center">

        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-green-600">
          Solar Energy Solutions
        </p>

        <h1 className="max-w-4xl text-4xl font-bold text-gray-900 md:text-6xl">
          Power Your Future With Solar Energy
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-gray-600">
          Reliable solar solutions for homes and businesses.
          From consultation and installation to maintenance,
          we help you move toward cleaner and smarter energy.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700">
            Get Free Quote
          </button>

          <button className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-100">
            Our Services
          </button>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-gray-50 px-6 py-20 md:px-12 lg:px-20">

        <div className="mx-auto max-w-6xl">

          {/* Section Heading */}
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-green-600">
              Why Choose Us
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
              Reliable Solar Solutions You Can Trust
            </h2>

            <p className="mt-4 text-gray-600">
              We focus on quality, reliability, and long-term customer
              support from installation to after-sales service.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {/* Card 1 */}
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
                🔧
              </div>

              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                Professional Installation
              </h3>

              <p className="mt-3 text-gray-600">
                Safe and professional solar installation designed for
                reliable performance and long-term operation.
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
                ☀️
              </div>

              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                Quality Solar Equipment
              </h3>

              <p className="mt-3 text-gray-600">
                We use quality solar panels, inverters, and components
                selected for dependable energy generation.
              </p>
            </div>

            {/* Card 3 */}
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
                👷
              </div>

              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                Experienced Team
              </h3>

              <p className="mt-3 text-gray-600">
                Our team supports consultation, site assessment,
                installation, and project execution.
              </p>
            </div>

            {/* Card 4 */}
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
                🛠️
              </div>

              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                After-Sales Support
              </h3>

              <p className="mt-3 text-gray-600">
                Continued support after installation for maintenance,
                service requests, and long-term system care.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Solar Services Section */}
      <section className="bg-white px-6 py-20 md:px-12 lg:px-20">

        <div className="mx-auto max-w-6xl">

          {/* Section Heading */}
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-green-600">
              Our Services
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
              Solar Solutions Designed For You
            </h2>

            <p className="mt-4 text-gray-600">
              From selecting the right solar system to installation and
              ongoing maintenance, we support your complete solar journey.
            </p>
          </div>

          {/* Services Cards */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {/* Residential Solar */}
            <div className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl transition group-hover:bg-green-600">
                🏠
              </div>

              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                Residential Solar
              </h3>

              <p className="mt-3 text-gray-600">
                Solar power solutions for homes designed to reduce
                electricity costs and support cleaner energy use.
              </p>

              <button className="mt-6 font-semibold text-green-600 hover:text-green-700">
                Learn More →
              </button>
            </div>

            {/* Commercial Solar */}
            <div className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl transition group-hover:bg-green-600">
                🏢
              </div>

              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                Commercial Solar
              </h3>

              <p className="mt-3 text-gray-600">
                Scalable solar solutions for offices, shops, businesses,
                and other commercial properties.
              </p>

              <button className="mt-6 font-semibold text-green-600 hover:text-green-700">
                Learn More →
              </button>
            </div>

            {/* Installation */}
            <div className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl transition group-hover:bg-green-600">
                🔩
              </div>

              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                Solar Installation
              </h3>

              <p className="mt-3 text-gray-600">
                Professional installation with proper system setup,
                testing, and commissioning for reliable operation.
              </p>

              <button className="mt-6 font-semibold text-green-600 hover:text-green-700">
                Learn More →
              </button>
            </div>

            {/* Maintenance */}
            <div className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl transition group-hover:bg-green-600">
                🧰
              </div>

              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                Solar Maintenance
              </h3>

              <p className="mt-3 text-gray-600">
                Ongoing maintenance and service support to help keep your
                solar system performing efficiently.
              </p>

              <button className="mt-6 font-semibold text-green-600 hover:text-green-700">
                Learn More →
              </button>
            </div>

          </div>
        </div>
      </section>
      {/* How It Works Section */}
      <section className="bg-gray-50 px-6 py-20 md:px-12 lg:px-20">

        <div className="mx-auto max-w-6xl">

          {/* Section Heading */}
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-green-600">
              How It Works
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
              Your Solar Journey Made Simple
            </h2>

            <p className="mt-4 text-gray-600">
              From your first enquiry to a fully operational solar system,
              we make the process simple and transparent.
            </p>
          </div>

          {/* Steps */}
          <div className="mt-14 grid gap-8 md:grid-cols-5">

            {/* Step 1 */}
            <div className="relative text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-xl font-bold text-white">
                1
              </div>

              <h3 className="mt-5 text-lg font-semibold text-gray-900">
                Enquiry
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Tell us about your electricity needs and solar requirements.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-xl font-bold text-white">
                2
              </div>

              <h3 className="mt-5 text-lg font-semibold text-gray-900">
                Site Survey
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Our team evaluates your site, roof area, and installation
                requirements.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-xl font-bold text-white">
                3
              </div>

              <h3 className="mt-5 text-lg font-semibold text-gray-900">
                Quotation
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                We prepare a solar solution and quotation based on your
                requirements.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-xl font-bold text-white">
                4
              </div>

              <h3 className="mt-5 text-lg font-semibold text-gray-900">
                Installation
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Our installation team installs, tests, and commissions
                your solar system.
              </p>
            </div>

            {/* Step 5 */}
            <div className="relative text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-xl font-bold text-white">
                5
              </div>

              <h3 className="mt-5 text-lg font-semibold text-gray-900">
                Start Saving
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Your solar system is ready to generate clean energy for
                your home or business.
              </p>
            </div>

          </div>

        </div>
      </section>
            {/* Projects / Our Work Section */}
      <section className="bg-white px-6 py-20 md:px-12 lg:px-20">

        <div className="mx-auto max-w-6xl">

          {/* Section Heading */}
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-green-600">
              Our Projects
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
              Solar Solutions We’ve Delivered
            </h2>

            <p className="mt-4 text-gray-600">
              Explore some of the residential and commercial solar
              solutions completed by our team.
            </p>
          </div>

          {/* Project Cards */}
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

            {/* Project 1 */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">

              <div className="flex h-56 items-center justify-center bg-gradient-to-br from-green-100 via-green-50 to-gray-100">
                <div className="text-center">
                  <div className="text-6xl">🏠</div>
                  <p className="mt-3 font-semibold text-green-700">
                    Residential Solar
                  </p>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Home Rooftop Solar
                  </h3>

                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    Completed
                  </span>
                </div>

                <p className="mt-3 text-gray-600">
                  Residential rooftop solar installation designed for
                  efficient daily energy generation.
                </p>

                <div className="mt-5 flex items-center justify-between border-t pt-4 text-sm">
                  <span className="text-gray-500">
                    System Size
                  </span>

                  <span className="font-semibold text-gray-900">
                    5 kW
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Location
                  </span>

                  <span className="font-semibold text-gray-900">
                    Hyderabad
                  </span>
                </div>
              </div>
            </div>

            {/* Project 2 */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">

              <div className="flex h-56 items-center justify-center bg-gradient-to-br from-amber-100 via-yellow-50 to-gray-100">
                <div className="text-center">
                  <div className="text-6xl">🏢</div>
                  <p className="mt-3 font-semibold text-amber-700">
                    Commercial Solar
                  </p>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Business Rooftop System
                  </h3>

                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    Completed
                  </span>
                </div>

                <p className="mt-3 text-gray-600">
                  A commercial rooftop solution designed to support
                  business energy requirements.
                </p>

                <div className="mt-5 flex items-center justify-between border-t pt-4 text-sm">
                  <span className="text-gray-500">
                    System Size
                  </span>

                  <span className="font-semibold text-gray-900">
                    25 kW
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Location
                  </span>

                  <span className="font-semibold text-gray-900">
                    Secunderabad
                  </span>
                </div>
              </div>
            </div>

            {/* Project 3 */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">

              <div className="flex h-56 items-center justify-center bg-gradient-to-br from-blue-100 via-sky-50 to-gray-100">
                <div className="text-center">
                  <div className="text-6xl">⚡</div>
                  <p className="mt-3 font-semibold text-blue-700">
                    Large Solar Installation
                  </p>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Commercial Energy Project
                  </h3>

                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    Completed
                  </span>
                </div>

                <p className="mt-3 text-gray-600">
                  A larger-scale solar installation planned and executed
                  for consistent clean energy generation.
                </p>

                <div className="mt-5 flex items-center justify-between border-t pt-4 text-sm">
                  <span className="text-gray-500">
                    System Size
                  </span>

                  <span className="font-semibold text-gray-900">
                    50 kW
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Location
                  </span>

                  <span className="font-semibold text-gray-900">
                    Telangana
                  </span>
                </div>
              </div>
            </div>

            {/* Project 4 */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">

              <div className="flex h-56 items-center justify-center bg-gradient-to-br from-orange-100 via-amber-50 to-gray-100">
                <div className="text-center">
                  <div className="text-6xl">☀️</div>
                  <p className="mt-3 font-semibold text-orange-700">
                    Residential Solar
                  </p>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Family Home Installation
                  </h3>

                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    Completed
                  </span>
                </div>

                <p className="mt-3 text-gray-600">
                  A rooftop solar installation planned around the
                  customer's household energy requirements.
                </p>

                <div className="mt-5 flex items-center justify-between border-t pt-4 text-sm">
                  <span className="text-gray-500">
                    System Size
                  </span>

                  <span className="font-semibold text-gray-900">
                    3 kW
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Location
                  </span>

                  <span className="font-semibold text-gray-900">
                    Hyderabad
                  </span>
                </div>
              </div>
            </div>

            {/* Project 5 */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">

              <div className="flex h-56 items-center justify-center bg-gradient-to-br from-emerald-100 via-green-50 to-gray-100">
                <div className="text-center">
                  <div className="text-6xl">🏭</div>
                  <p className="mt-3 font-semibold text-emerald-700">
                    Industrial Solar
                  </p>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Industrial Rooftop Project
                  </h3>

                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    Completed
                  </span>
                </div>

                <p className="mt-3 text-gray-600">
                  A scalable rooftop solar solution designed for
                  industrial energy requirements.
                </p>

                <div className="mt-5 flex items-center justify-between border-t pt-4 text-sm">
                  <span className="text-gray-500">
                    System Size
                  </span>

                  <span className="font-semibold text-gray-900">
                    100 kW
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Location
                  </span>

                  <span className="font-semibold text-gray-900">
                    Telangana
                  </span>
                </div>
              </div>
            </div>

            {/* Project 6 */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">

              <div className="flex h-56 items-center justify-center bg-gradient-to-br from-cyan-100 via-blue-50 to-gray-100">
                <div className="text-center">
                  <div className="text-6xl">🔋</div>
                  <p className="mt-3 font-semibold text-cyan-700">
                    Solar Energy System
                  </p>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Hybrid Solar Solution
                  </h3>

                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    Completed
                  </span>
                </div>

                <p className="mt-3 text-gray-600">
                  A customized solar energy solution designed around
                  specific power requirements.
                </p>

                <div className="mt-5 flex items-center justify-between border-t pt-4 text-sm">
                  <span className="text-gray-500">
                    System Size
                  </span>

                  <span className="font-semibold text-gray-900">
                    10 kW
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Location
                  </span>

                  <span className="font-semibold text-gray-900">
                    Hyderabad
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* View More Button */}
          <div className="mt-12 text-center">
            <button className="rounded-lg bg-green-600 px-7 py-3 font-semibold text-white transition hover:bg-green-700">
              View All Projects
            </button>
          </div>

        </div>
      </section>
            {/* Customer Testimonials Section */}
      <section className="bg-gray-50 px-6 py-20 md:px-12 lg:px-20">

        <div className="mx-auto max-w-6xl">

          {/* Section Heading */}
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-green-600">
              Customer Testimonials
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
              What Our Customers Say
            </h2>

            <p className="mt-4 text-gray-600">
              Hear from customers about their experience with our solar
              consultation, installation, and support services.
            </p>
          </div>

          {/* Testimonials */}
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {/* Testimonial 1 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

              <div className="flex items-center gap-1 text-lg">
                ★★★★★
              </div>

              <p className="mt-5 leading-7 text-gray-600">
                "The team explained the entire solar process clearly and
                completed the installation professionally. The overall
                experience was smooth from start to finish."
              </p>

              <div className="mt-6 flex items-center gap-4 border-t pt-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 font-bold text-green-700">
                  RK
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Raj Kumar
                  </h3>

                  <p className="text-sm text-gray-500">
                    Hyderabad
                  </p>
                </div>
              </div>

            </div>

            {/* Testimonial 2 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

              <div className="flex items-center gap-1 text-lg">
                ★★★★★
              </div>

              <p className="mt-5 leading-7 text-gray-600">
                "We received clear information about the system and the
                installation team was responsive throughout the project.
                The support after installation was also helpful."
              </p>

              <div className="mt-6 flex items-center gap-4 border-t pt-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 font-bold text-green-700">
                  SP
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    S. Priya
                  </h3>

                  <p className="text-sm text-gray-500">
                    Secunderabad
                  </p>
                </div>
              </div>

            </div>

            {/* Testimonial 3 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

              <div className="flex items-center gap-1 text-lg">
                ★★★★★
              </div>

              <p className="mt-5 leading-7 text-gray-600">
                "From the initial consultation to project completion, the
                communication was straightforward and the team kept us
                informed about each stage."
              </p>

              <div className="mt-6 flex items-center gap-4 border-t pt-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 font-bold text-green-700">
                  AM
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Arun Mehta
                  </h3>

                  <p className="text-sm text-gray-500">
                    Telangana
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white px-6 py-20 md:px-12 lg:px-20">

        <div className="mx-auto max-w-4xl">

          {/* Section Heading */}
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-green-600">
              FAQ
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
              Frequently Asked Questions
            </h2>

            <p className="mt-4 text-gray-600">
              Find answers to common questions about solar installation,
              system selection, maintenance, and our services.
            </p>
          </div>

          {/* FAQ Items */}
          <div className="mt-12 space-y-4">

            {/* FAQ 1 */}
            <details className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-semibold text-gray-900">
                <span>
                  How does a rooftop solar system work?
                </span>

                <span className="text-2xl text-green-600 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 max-w-3xl leading-7 text-gray-600">
                Solar panels convert sunlight into electricity. The system
                then uses an inverter to convert that electricity into a
                usable form for your home or business.
              </p>
            </details>

            {/* FAQ 2 */}
            <details className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-semibold text-gray-900">
                <span>
                  How do I know what solar system size I need?
                </span>

                <span className="text-2xl text-green-600 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 max-w-3xl leading-7 text-gray-600">
                System sizing depends on factors such as electricity
                consumption, available roof area, site conditions, and
                your energy requirements. A site assessment can help
                determine a suitable system size.
              </p>
            </details>

            {/* FAQ 3 */}
            <details className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-semibold text-gray-900">
                <span>
                  How long does solar installation take?
                </span>

                <span className="text-2xl text-green-600 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 max-w-3xl leading-7 text-gray-600">
                Installation time varies depending on the system size,
                site conditions, approvals, and project requirements.
                Your team can provide a project-specific timeline after
                the site survey.
              </p>
            </details>

            {/* FAQ 4 */}
            <details className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-semibold text-gray-900">
                <span>
                  Do you provide maintenance after installation?
                </span>

                <span className="text-2xl text-green-600 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 max-w-3xl leading-7 text-gray-600">
                Yes. You can provide post-installation support,
                maintenance, inspections, and service assistance based
                on the customer's requirements and your service plans.
              </p>
            </details>

            {/* FAQ 5 */}
            <details className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-semibold text-gray-900">
                <span>
                  Can I request a solar quote online?
                </span>

                <span className="text-2xl text-green-600 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 max-w-3xl leading-7 text-gray-600">
                Yes. Customers can submit their basic requirements
                through the online quote form. Your team can then review
                the enquiry and contact the customer for the next steps.
              </p>
            </details>

            {/* FAQ 6 */}
            <details className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-semibold text-gray-900">
                <span>
                  Can customers track their solar project online?
                </span>

                <span className="text-2xl text-green-600 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 max-w-3xl leading-7 text-gray-600">
                Yes. In the customer portal we are building, customers
                will be able to view their project status, quotations,
                documents, payments, and service requests.
              </p>
            </details>

          </div>

        </div>
      </section>
            {/* Free Quote Section */}
      <section className="bg-green-700 px-6 py-20 md:px-12 lg:px-20">

        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">

          {/* Left Content */}
          <div className="text-white">

            <p className="text-sm font-semibold uppercase tracking-widest text-green-200">
              Get Started
            </p>

            <h2 className="mt-3 text-3xl font-bold md:text-5xl">
              Get Your Free Solar Quote
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-green-50">
              Tell us a little about your energy requirements and our team
              can get in touch with you to discuss a suitable solar solution.
            </p>

            <div className="mt-8 space-y-4">

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15">
                  ✓
                </div>

                <div>
                  <h3 className="font-semibold">
                    Free Initial Consultation
                  </h3>

                  <p className="mt-1 text-sm text-green-100">
                    Discuss your requirements with our team.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15">
                  ✓
                </div>

                <div>
                  <h3 className="font-semibold">
                    Site Assessment
                  </h3>

                  <p className="mt-1 text-sm text-green-100">
                    Understand your site and solar requirements.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15">
                  ✓
                </div>

                <div>
                  <h3 className="font-semibold">
                    Customized Solution
                  </h3>

                  <p className="mt-1 text-sm text-green-100">
                    Receive a solution based on your requirements.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Quote Form */}
          <div className="rounded-3xl bg-white p-6 shadow-2xl sm:p-8">

            <h3 className="text-2xl font-bold text-gray-900">
              Request a Quote
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              Fill in your details and our team will contact you.
            </p>

            <QuoteForm />


          </div>
       </div>

      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-300">

        <div className="mx-auto max-w-6xl px-6 py-16 md:px-12 lg:px-20">

          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

            {/* Company */}
            <div>
              <div className="text-2xl font-bold text-green-500">
                SolarPower
              </div>

              <p className="mt-4 max-w-sm text-sm leading-7 text-gray-400">
                Reliable solar energy solutions for homes and businesses,
                from consultation and installation to ongoing support.
              </p>

              <div className="mt-6 flex gap-3">
                <a
                  href="#"
                  aria-label="Facebook"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-700 text-sm font-semibold transition hover:border-green-500 hover:text-green-500"
                >
                  f
                </a>

                <a
                  href="#"
                  aria-label="Instagram"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-700 text-sm font-semibold transition hover:border-green-500 hover:text-green-500"
                >
                  ig
                </a>

                <a
                  href="#"
                  aria-label="LinkedIn"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-700 text-sm font-semibold transition hover:border-green-500 hover:text-green-500"
                >
                  in
                </a>

                <a
                  href="#"
                  aria-label="YouTube"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-700 text-sm font-semibold transition hover:border-green-500 hover:text-green-500"
                >
                  ▶
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-white">
                Quick Links
              </h3>

              <div className="mt-5 space-y-3 text-sm">
                <a
                  href="#"
                  className="block transition hover:text-green-500"
                >
                  Home
                </a>

                <a
                  href="#"
                  className="block transition hover:text-green-500"
                >
                  About Us
                </a>

                <a
                  href="#"
                  className="block transition hover:text-green-500"
                >
                  Services
                </a>

                <a
                  href="#"
                  className="block transition hover:text-green-500"
                >
                  Projects
                </a>

                <a
                  href="#"
                  className="block transition hover:text-green-500"
                >
                  Contact
                </a>
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-semibold text-white">
                Our Services
              </h3>

              <div className="mt-5 space-y-3 text-sm">
                <a
                  href="#"
                  className="block transition hover:text-green-500"
                >
                  Residential Solar
                </a>

                <a
                  href="#"
                  className="block transition hover:text-green-500"
                >
                  Commercial Solar
                </a>

                <a
                  href="#"
                  className="block transition hover:text-green-500"
                >
                  Solar Installation
                </a>

                <a
                  href="#"
                  className="block transition hover:text-green-500"
                >
                  Solar Maintenance
                </a>

                <a
                  href="#"
                  className="block transition hover:text-green-500"
                >
                  Solar Consultation
                </a>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold text-white">
                Contact Us
              </h3>

              <div className="mt-5 space-y-4 text-sm">

                <div className="flex gap-3">
                  <span className="text-green-500">📍</span>

                  <p>
                    Suryapet, Telangana, India
                  </p>
                </div>

                <div className="flex gap-3">
                  <span className="text-green-500">📞</span>

                  <a
                    href="tel:+919999999999"
                    className="transition hover:text-green-500"
                  >
                    +91 99999 99999
                  </a>
                </div>

                <div className="flex gap-3">
                  <span className="text-green-500">✉</span>

                  <a
                    href="mailto:info@rohithsolarsolutions.in"
                    className="transition hover:text-green-500"
                  >
                    info@rohithsolarsolutions.in
                  </a>
                </div>

                <div className="flex gap-3">
                  <span className="text-green-500">🕒</span>

                  <p>
                    Mon – Sat: 9:00 AM – 6:00 PM
                  </p>
                </div>

              </div>
            </div>

          </div>

          {/* Bottom Footer */}
          <div className="mt-12 border-t border-gray-800 pt-6">

            <div className="flex flex-col gap-4 text-sm text-gray-500 md:flex-row md:items-center md:justify-between">

              <p>
                © {new Date().getFullYear()} SolarPower. All rights reserved.
              </p>

              <div className="flex gap-6">
                <a
                  href="#"
                  className="transition hover:text-green-500"
                >
                  Privacy Policy
                </a>

                <a
                  href="#"
                  className="transition hover:text-green-500"
                >
                  Terms & Conditions
                </a>
              </div>

            </div>

          </div>

        </div>

      </footer>
    </main>
  );
}
