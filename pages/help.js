import Header from '../components/Header'
import Footer from '../components/Footer'
import Link from 'next/link'

export default function Help() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold text-gray-800">Help Center</h1>
        <p className="mt-2 text-gray-600">Find quick answers and resources.</p>

        <section className="mt-6 space-y-4">
          <div className="border rounded-md p-4">
            <h2 className="text-lg font-medium text-gray-800">Frequently Asked Questions</h2>
            <p className="text-gray-600 mt-1">Browse common questions about accounts, pet listings, and safety.</p>
            <Link href="/faq" className="inline-block mt-3 px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700">Go to FAQ</Link>
          </div>

          <div className="border rounded-md p-4">
            <h2 className="text-lg font-medium text-gray-800">Need more help?</h2>
            <p className="text-gray-600 mt-1">If your question isn’t covered, contact us and we’ll get back to you.</p>
            <a href="mailto:support@adoptus.ca" className="inline-block mt-3 px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-50">Contact Support</a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

