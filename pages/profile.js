import Header from '../components/Header'
import '../configureAmplify'
import SignIn from '../components/SignIn';

function Profile() {
    return (
        <div className='bg-slate-100'>
            <Header />
            <SignIn />
        </div>
    )
}

export default Profile