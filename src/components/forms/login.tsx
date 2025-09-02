import { Link } from "@tanstack/react-router"

export function LoginForm(){
  return <form>
    <label>Username<input type='text'/></label>
    <label>Password<input type='password'/></label>
    <p>Do not have an account?<Link to="/signup"> Sign up.</Link></p>
    <button type='submit'>Send</button>
  </form>
}