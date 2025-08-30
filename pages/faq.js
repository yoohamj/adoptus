import Header from '../components/Header'
import Footer from '../components/Footer'

const faqs = [
  { q: 'How do I register a pet?', a: 'Go to Register and complete the 3-step form. You will need basic pet details, your contact info, and any special notes. You can also upload photos.' },
  { q: 'Do I need an account to list a pet?', a: 'Yes. You must sign in to create or manage listings so we can protect your information and prevent abuse.' },
  { q: 'How do I update my profile?', a: 'Open the menu and select Settings. You can change your photo, name, birthdate, and contact details.' },
  { q: 'How are my photos stored?', a: 'We store images securely in Amazon S3. You can remove or replace them from your listing or by contacting support.' },
  { q: 'I forgot my password. What do I do?', a: 'Use the Sign In page and click “Forgot password” to reset it via your email address.' },
]

export default function FAQ() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold text-gray-800">Frequently Asked Questions</h1>
        <div className="mt-6 divide-y">
          {faqs.map((item, idx) => (
            <details key={idx} className="py-4">
              <summary className="cursor-pointer font-medium text-gray-800 focus:outline-none focus:underline">
                {item.q}
              </summary>
              <p className="mt-2 text-gray-600">{item.a}</p>
            </details>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}

