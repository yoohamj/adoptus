import Header from '../components/Header'
import PetRegistrationForm from '../components/PetRegistrationForm'

function Register() {
  return (
    <div className='bg-white min-h-screen'>
      <Header />
      <main className="py-6">
        <PetRegistrationForm />
      </main>
    </div>
  )
}

export default Register
