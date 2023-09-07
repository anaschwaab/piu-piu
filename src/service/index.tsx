import { backendRoutes } from "../routes";
import { Api } from "./api";
import { LoginProps } from "../types/Users";
import { RegisterProps } from "../types/Users";

export async function Login({ handle, password }: LoginProps) {
    try {
        const response = await Api.post(backendRoutes.login, {
            handle,
            password
        })
        const { data } = response
        return data;
    } catch (error) {
        console.log(error);
    }
}

export async function Register( { name, handle, password }: RegisterProps) {
    try {
        const response = await Api.post(backendRoutes.signup, {
            name,
            handle, 
            password
        })
        const { data } = response
        return data;
    } catch (error) {
        console.log(error);
    }
}

