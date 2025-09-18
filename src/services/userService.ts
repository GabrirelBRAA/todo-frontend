import { type User } from "../context/userContext";

export interface UserAccountCreationData{
	username: string,
	password: string,
	email: string,
	firstname: string,
	lastname: string,
	role: 0
}

class UserService {
	private url: string;
	private currentUser: User = { is_authenticated: null };

	constructor(url: string) {
		this.url = url;
	}

	async me(): Promise<{
		id: string;
		username: string;
		firstname: string;
		lastname: string;
		role: "NORMAL" | "ADMIN" | "SUPERADMIN";
	}> {
		const url = `${this.url}/me`;
		const response = await fetch(url, {
            credentials: 'include'
        });
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}
		const result = await response.json();
		this.currentUser = {...result, is_authenticated: true};
		return result;
	}

	async login(username: string, password: string) {
		const url = `${this.url}/login`;
		const response = await fetch(url, {
			method: "POST",
            credentials: 'include',
			body: new URLSearchParams({
				username: username,
				password: password,
			}),
		});
		const result = await response.json();
		if (!response.ok) {
			//important that fast api sends error at detail, if I ever change this it might create a bug
			throw new Error(result["detail"]);
		}
		return result;
	}

	async logoff(){
		const url = `${this.url}/logoff`;
		const response = await fetch(url, {
			method: "POST",
            credentials: 'include',
		});
		if (!response.ok) {
			//important that fast api sends error at detail, if I ever change this it might create a bug
			throw new Error("Failed to logoff");
		}
	}

	async signup(userData: UserAccountCreationData) {
		const url = `${this.url}/users`;
		const response = await fetch(url, {
			method: "POST",
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(userData)
		});
		if (!response.ok) {
			//important that fast api sends error at detail, if I ever change this it might create a bug
			const result = await response.json()
			throw new Error(result['detail']);
		}
	}

	isAuthenticated() {
		return this.currentUser.is_authenticated;
	}
}

export const userService = new UserService("http://127.0.0.1:8000");
