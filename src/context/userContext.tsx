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

export interface UserContextType {
    user: User;
    refreshUser: () => Promise<void>
}

export const UserContext = createContext<UserContextType>({user: {is_authenticated: null}, refreshUser: async () => {}})

