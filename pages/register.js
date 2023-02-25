import Header from '../components/Header'
import Selection from '../components/Selection'
import '../configureAmplify'
import { Auth, API, graphqlOperation } from 'aws-amplify';
import kaymak from "../images/kaymak.jpg";
import corgi from "../images/Corgi.jpeg";
import Radio from '../components/Radio';

function Register() {
    return (
        <div className='bg-white'>
            <Header />
        </div>    
    )
}

export default Register