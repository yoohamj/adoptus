import Header from '../components/Header'
import '../configureAmplify'
import SignIn from '../components/SignIn';

function Profile() {
    return (
        <div className='bg-rose-50'>
            <Header />
            <SignIn />
        </div>
    )
}

export default Profile
