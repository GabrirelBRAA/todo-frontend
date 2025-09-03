import { createContext } from "react";

//optional fields are present if user is authenticated, otherwise no
export interface User {
    is_authenticated: boolean | null
	id?: string;
	username?: string;
	firstname?: string;
	lastname?: string;
	role?: "NORMAL" | "ADMIN" | "SUPERADMIN";
}

export const UserContext = createContext<User>({is_authenticated: null})

