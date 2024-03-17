import { UserEntity } from "../../../entities/auth/User.entity";
import httpClient from "../../../http/httpClient";
import { userGateway } from "../../interfaces/auth/userGateway";
export type signUpOutput = {
    status: number,
    user?: UserEntity,
    message: string,
    token?: string
}
export type Output = {
    status: number,
    message: string,
}
export type verifyAccountOutput = {
    status: number,
    user?: UserEntity,
    message: string,
    token?: string
}
export type loginInput = {
    email: string;
    password: string;
}
export class HttpUserGateway implements userGateway {
    constructor(readonly httpClient: httpClient) {}
    async signUp(user: UserEntity): Promise<signUpOutput> {
        const response = await this.httpClient.post("auth/save/user", user.props);
        if (response && response.status < 300) {
            const userRes =  new UserEntity({
                email: response.data.user.email,
                name: response.data.user.userName,
                password: response.data.user.password,
                uuid: response.data.user.uuid,
            })
            return {
                token: response.data.token,
                status: response.status,
                user: userRes,
                message: response.data.message,
            }
        }
        return {
            status: response.status,
            message: response.data.message,
        }
    }
    async ResendEmailVerifyAccountToUser(email: string): Promise<Output> {
        const response = await this.httpClient.get(`auth/resend/verify-email/${email}`);
        return {
            status: response.statusCode,
            message: response.message,
        }
    }
    async verifyAccount(token: string): Promise<Output> {
        const response = await this.httpClient.get("auth/verify/account/"+token);
        return {
            status: response.status,
            message: response.message,
        }
    }
    async Login(input: loginInput): Promise<signUpOutput> {
        const response = await this.httpClient.post("auth/login", input);
        if (response && response.status < 300) {
            const userRes =  new UserEntity({
                email: response.data.user.email,
                name: response.data.user.userName,
                password: response.data.user.password,
                uuid: response.data.user.uuid,
                token: response.data.token,
            })
            return {
                token: response.data.token,
                status: response.status,
                user: userRes,
                message: response.data.message,
            }
        }
        return {
            status: response.status,
            message: response.data.message,
        }
    }
}