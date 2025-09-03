import { type JSX, useEffect, useState } from "react";
import { userService } from "../../services/userService";
import { type User, UserContext } from "../../context/userContext";


interface AuthenticatedUser extends User {
    is_authenticated: true 
	id: string;
	username: string;
	firstname: string;
	lastname: string;
	role: "NORMAL" | "ADMIN" | "SUPERADMIN";
}

export function AuthProvider({ children }: { children: JSX.Element }) {
	const [user, setUser] = useState<User>({is_authenticated: null});

	useEffect(() => {
		async function getUser() {
			try {
				const userData = await userService.me();
				setUser({...userData, is_authenticated: true});
			} catch {
				setUser({is_authenticated: false});
			}
		}
        getUser()
	}, []);

    //Implement a loading component here
    if (user.is_authenticated == null){
        return <>Loading...</>
    }

	return <UserContext value={user}>{children}</UserContext>;
}
