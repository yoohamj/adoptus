import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Privacy() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-semibold text-gray-800">Privacy Policy</h1>
        <p className="text-gray-600 mt-2">Last updated: {new Date().getFullYear()}</p>

        <section className="mt-6 space-y-4 text-gray-700">
          <p>We respect your privacy. This policy explains what personal data we collect, how we use it, and your choices.</p>

          <h2 className="text-xl font-semibold mt-6">1. Information We Collect</h2>
          <p>We collect account information (such as name and email), profile details you provide, and usage data.</p>

          <h2 className="text-xl font-semibold mt-6">2. How We Use Information</h2>
          <p>We use your information to provide and improve AdoptUs, communicate with you, and keep our platform safe.</p>

          <h2 className="text-xl font-semibold mt-6">3. Sharing</h2>
          <p>We do not sell your personal information. We may share data with service providers to operate AdoptUs.</p>

          <h2 className="text-xl font-semibold mt-6">4. Your Choices</h2>
          <p>You can access and update your information in Settings. You may request deletion of your account.</p>

          <h2 className="text-xl font-semibold mt-6">5. Contact</h2>
          <p>For privacy questions or requests, contact us via the Help page.</p>
        </section>
      </main>
      <Footer />
    </div>
  )
}

