import Header from '../components/Header'

import { useState, useEffect } from "react";
import { Auth } from 'aws-amplify'
import '../configureAmplify'

function Profile() {
    useEffect(() => {
        checkuser()
        async function checkuser() {
            const user = await Auth.currentAuthenticatedUser()
            console.log({ user })
        }
    }, [])
    return (
        <div>
            <Header />
            <button onClick={() => Auth.federatedSignIn({provider: "Google"})}>
                Sign in with Google
            </button>
            <button onClick={() => Auth.federatedSignIn({provider: "Facebook"})}>
                Sign in with Facebook
            </button>
            
        </div>
    )
}

export default Profile