import { type JSX, useState, type FormEventHandler } from "react"
import { SpanError } from "./spanerror"
import { Link } from "@tanstack/react-router"

interface SignUpFormErrors{
  username: JSX.Element | null
  password: JSX.Element | null
  confirmPassword: JSX.Element | null
}

export function SignUpForm(){

  const [signUpFormErrors, setSignUpFormErrors] = useState<SignUpFormErrors>({password: null, confirmPassword: null, username: null})

  const submitSignUpForm: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const newErrors: SignUpFormErrors = {
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
    //if all ok send request and process
    //if not ok send backend errors to form
    setSignUpFormErrors(newErrors);
  }

  return <form onSubmit={submitSignUpForm}>
    <label>Username {signUpFormErrors.username}<input type='text' name='username'/></label>
    <label>First name<input type='text'/></label>
    <label>Second name<input type='text'/></label>
    <label>Email<input type='email'/></label>
    <label>Password {signUpFormErrors['password']}<input name='password' type='password'/></label>
    <label>Confirm password {signUpFormErrors.confirmPassword}<input name='confirmpassword' type='password'/></label>
    <p>Already have an account?<Link to="/login"> Login.</Link></p>
    <button type='submit'>Send</button>
  </form>
}