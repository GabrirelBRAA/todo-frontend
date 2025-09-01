import { useState, type FormEventHandler, type JSX, } from 'react'
import './App.css'
import { FormContainer } from './components/form-container/FormContainer'

function SpanError({errorString}: {errorString: string}){
  return <span className='error'>{errorString}</span>
}

interface SignInFormErrors{
  username: JSX.Element | null
  password: JSX.Element | null
  confirmPassword: JSX.Element | null
}

function App() {

  const loginForm = <form>
    <label>Username<input type='text'/></label>
    <label>Password<input type='password'/></label>
    <p>Do not have an account?<a> Sign up.</a></p>
    <button type='submit'>Send</button>
  </form>

  const [signInFormErrors, setSignInFormErrors] = useState<SignInFormErrors>({password: null, confirmPassword: null, username: null})


  const submitSignUpForm: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const newErrors: SignInFormErrors = {
      username: null,
      password: null,
      confirmPassword: null
    };
    if(form.get('username') && form.get('username')!.toString(). length < 4){
      newErrors.username = <SpanError errorString='*must be bigger than 4 characters'/>
    }
    if (form.get('password') && form.get('password')!.toString().length < 8){
      newErrors.password = <SpanError errorString='*must be bigger than 8 characters.'/>
    }
    if (form.get('confirmpassword') && form.get('password') && form.get('confirmpassword')!.toString() != form.get('password')!.toString()){
      newErrors.confirmPassword = <SpanError errorString='*must match password.'/>
    }
    setSignInFormErrors(newErrors);
  }

  const signUpForm = <form onSubmit={submitSignUpForm}>
    <label>Username {signInFormErrors.username}<input type='text' name='username'/></label>
    <label>First name<input type='text'/></label>
    <label>Second name<input type='text'/></label>
    <label>Email<input type='email'/></label>
    <label>Password {signInFormErrors['password']}<input name='password' type='password'/></label>
    <label>Confirm password {signInFormErrors.confirmPassword}<input name='confirmpassword' type='password'/></label>
    <button type='submit'>Send</button>
  </form>

  return (
    <FormContainer form={signUpForm} formName='Sign up'/>
  )
}

export default App
