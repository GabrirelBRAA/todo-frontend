import { type JSX, useState, type FormEventHandler, useContext } from "react"
import { SpanError } from "./spanerror"
import { Link } from "@tanstack/react-router"
import { userService } from "../../services/userService"
import { UserContext } from "../../context/userContext"
import { useNavigate } from "@tanstack/react-router"

interface SignUpFormErrors{
  username: JSX.Element | null
  password: JSX.Element | null
  confirmPassword: JSX.Element | null
  backend: JSX.Element | null
}

export function SignUpForm(){

  const [signUpFormErrors, setSignUpFormErrors] = useState<SignUpFormErrors>({password: null, confirmPassword: null, username: null, backend: null})
  const { refreshUser } = useContext(UserContext)
  const navigate = useNavigate({from: '/signup'})

  const submitSignUpForm: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const newErrors: SignUpFormErrors = {
      username: null,
      password: null,
      confirmPassword: null,
      backend: null
    };
    if(form.get('username') && form.get('username')!.toString().length < 4){
      newErrors.username = <SpanError errorString='*must be bigger than 4 characters'/>
    }
    if (form.get('password') && form.get('password')!.toString().length < 8){
      newErrors.password = <SpanError errorString='*must be bigger than 8 characters.'/>
    }
    if (form.get('confirmpassword') && form.get('password') && form.get('confirmpassword')!.toString() != form.get('password')!.toString()){
      newErrors.confirmPassword = <SpanError errorString='*must match password.'/>
    }
    if (newErrors.username == null && newErrors.password == null && newErrors.confirmPassword == null){
      try{
        await userService.signup({
          username: form.get('username')!.toString(),
          password: form.get('password')!.toString(),
          firstname: form.get('firstname')!.toString(),
          lastname: form.get('lastname')!.toString(),
          email: form.get('email')!.toString(),
          role: 0
        })
        try{
				await userService.login(
					form.get("username")!.toString(),
					form.get("password")!.toString()
				); //this is also not ideal
        await refreshUser!()
        navigate({to: '/dashboard'})
        } catch {
          navigate({to: '/'})
        }
      } catch (e: unknown){
				if (e instanceof Error) {
					newErrors.backend = <SpanError errorString={'*' + e.message} />;
					setSignUpFormErrors(newErrors);
				}
      }
    }
    //if all ok send request and proces
    //if not ok send backend errors to form
    setSignUpFormErrors(newErrors);
  }

  return <form onSubmit={submitSignUpForm}>
    <label>Username {signUpFormErrors.username}<input type='text' required name='username'/></label>
    <label>First name<input type='text' name="firstname" required/></label>
    <label>Second name<input type='text' name="lastname" required/></label>
    <label>Email<input type='email' name="email" required/></label>
    <label>Password {signUpFormErrors['password']}<input name='password' type='password'/></label>
    <label>Confirm password {signUpFormErrors.confirmPassword}<input name='confirmpassword' type='password' required/></label>
    <p>Already have an account?<Link to="/"> Login.</Link></p>
            {signUpFormErrors.backend ? (<div>
                {signUpFormErrors.backend}
            </div>) : null}
    <button type='submit'>Send</button>
  </form>
}