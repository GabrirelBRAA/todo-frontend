import { useState, type FormEventHandler } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { FormContainer } from './components/form-container/FormContainer'

function App() {
  const [count, setCount] = useState(0)

  const loginForm = <form>
    <label>Username<input type='text'/></label>
    <label>Password<input type='password'/></label>
    <p>Do not have an account?<a> Sign up.</a></p>
    <button type='submit'>Send</button>
  </form>

  const error = <span className='error'>*Erro 1</span>

  const submitSignUpForm: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    console.log(form.get('username'))
  }

  const signUpForm = <form onSubmit={submitSignUpForm}>
    <label>Username {error}<input type='text' name='username'/></label>
    <label>First name<input type='text'/></label>
    <label>Second name<input type='text'/></label>
    <label>Email<input type='email'/></label>
    <label>Password<input type='password'/></label>
    <label>Confirm password<input type='password'/></label>
    <button type='submit'>Send</button>
  </form>

  return (
    <>
    <FormContainer form={signUpForm} formName='Sign up'/>
      <div>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
