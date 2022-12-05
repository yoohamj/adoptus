import Header from '../components/Header'

import { useState, useEffect } from "react";
import { Auth } from 'aws-amplify'
import '../configureAmplify'
import SignIn from '../components/SignIn';

const initialState = { email: '', password: '', authcode: '' }

function Profile() {
    const [uiState, setUiState] = useState(null)
    const [formState, setFormState] = useState ({

    })

    useEffect(() => {
        checkuser()
        async function checkuser() {
            const user = await Auth.currentAuthenticatedUser()
            console.log({ user })
        }
    }, [])

function onChange(e) {
    setFormState({ ...formState, [e.target.name]: e.target.value })
}
    return (
        <div className='bg-slate-100'>
            <Header />
            <SignIn />
        </div>
    )
}

export default Profile