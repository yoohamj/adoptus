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
            <div>
            <ul class="stepper" data-mdb-stepper="stepper">
                <li class="stepper-step stepper-active">
                    <div class="stepper-head">
                    <span class="stepper-head-icon"> 1 </span>
                    <span class="stepper-head-text"> Pet Info </span>
                    </div>
                    <div class="stepper-content">
                        <h2 className='text-3xl font-semibold p-5 text-center'>Tell Us About Your Pet</h2>
                        <ul class="grid gap-6 w-full md:grid-cols-2">
                        <li>
                            <input type="radio" id="hosting-big" name="hosting" value="hosting-big" class="hidden peer" />
                            <label for="hosting-big" class="inline-flex justify-between items-center p-5 w-full text-gray-500 bg-white rounded-lg border border-gray-200 cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                                <div class="block">
                                    <div class="w-full text-lg font-semibold">I have a Cat</div>
                                    <div class="w-full">{'>'} 1 Year</div>
                                </div>
                                <svg aria-hidden="true" class="ml-3 w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                            </label>
                        </li>
                    </ul>
                    </div>
                </li>

                <li class="stepper-step">
                    <div class="stepper-head">
                    <span class="stepper-head-icon"> 2 </span>
                    <span class="stepper-head-text"> Contact </span>
                    </div>
                    <div class="stepper-content">
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </div>
                </li>
                <li class="stepper-step">
                    <div class="stepper-head">
                    <span class="stepper-head-icon"> 3 </span>
                    <span class="stepper-head-text"> Policy </span>
                    </div>
                    <div class="stepper-content">
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                    </div>
                </li>
            </ul>
            </div>
        </div>    
    )
}

export default Register