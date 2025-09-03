import { type JSX, useState, type FormEventHandler } from "react";
import { Link, redirect } from "@tanstack/react-router";
import { SpanError } from "./spanerror";
import { userService } from "../../services/userService";

interface LoginFormErrors {
	username: JSX.Element | null;
	password: JSX.Element | null;
	backend: JSX.Element | null;
}
export function LoginForm() {
	const [loginFormErrors, setLoginFormErrors] = useState<LoginFormErrors>({
		password: null,
		username: null,
        backend: null
	});

	const submitLoginForm: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();
		const form = new FormData(e.currentTarget);
		const newErrors: LoginFormErrors = {
			username: null,
			password: null,
			backend: null,
		};
		if (form.get("username") && form.get("username")!.toString().length < 4) {
			newErrors.username = (
				<SpanError errorString="*must be bigger than 4 characters" />
			);
		}
		if (form.get("password") && form.get("password")!.toString().length < 8) {
			newErrors.password = (
				<SpanError errorString="*must be bigger than 8 characters." />
			);
		}
		if (newErrors.password == null && newErrors.username == null) {
			//this is kinda verbose
			try {
				await userService.login(
					form.get("username")!.toString(),
					form.get("password")!.toString()
				); //this is also not ideal
                throw redirect({to: '/dashboard'})
			} catch (e: unknown) {
				if (e instanceof Error) {
					newErrors.backend = <SpanError errorString={'*' + e.message} />;
					setLoginFormErrors(newErrors);
                    console.log(newErrors)
				}
			}
		} else {
            setLoginFormErrors(newErrors)
        }
	};

	return (
		<form onSubmit={submitLoginForm}>
			<label>
				Username {loginFormErrors.username}
				<input type="text" name="username" required />
			</label>
			<label>
				Password {loginFormErrors.password}
				<input type="password" name="password" required />
			</label>
			<p>
				Do not have an account?<Link to="/signup"> Sign up.</Link>
			</p>
            {loginFormErrors.backend ? (<div>
                {loginFormErrors.backend}
            </div>) : null}
			<button type="submit">Send</button>
		</form>
	);
}
