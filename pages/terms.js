import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Terms() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-semibold text-gray-800">Terms of Use</h1>
        <p className="text-gray-600 mt-2">Last updated: {new Date().getFullYear()}</p>

        <section className="mt-6 space-y-4 text-gray-700">
          <p>Welcome to AdoptUs. By accessing or using our website, you agree to these Terms of Use. Please read them carefully.</p>
          <h2 className="text-xl font-semibold mt-6">1. Eligibility</h2>
          <p>You must be at least 18 years old or have parental consent to use AdoptUs.</p>

          <h2 className="text-xl font-semibold mt-6">2. Your Account</h2>
          <p>You are responsible for maintaining the confidentiality of your account and password and for restricting access to your device.</p>

          <h2 className="text-xl font-semibold mt-6">3. Acceptable Use</h2>
          <p>You agree not to misuse AdoptUs, including posting false listings or engaging in fraudulent activity.</p>

          <h2 className="text-xl font-semibold mt-6">4. Content</h2>
          <p>By posting content, you grant AdoptUs a non-exclusive license to use and display that content in connection with the service.</p>

          <h2 className="text-xl font-semibold mt-6">5. Disclaimers</h2>
          <p>AdoptUs is provided on an as-is basis. We do not guarantee uninterrupted or error-free operation.</p>

          <h2 className="text-xl font-semibold mt-6">6. Contact</h2>
          <p>For questions about these Terms, contact us via the Help page.</p>
        </section>
      </main>
      <Footer />
    </div>
  )
}

