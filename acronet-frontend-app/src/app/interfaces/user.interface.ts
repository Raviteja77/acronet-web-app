export interface RegisterUser {
    user_name: string,
    user_type: string,
    email: string,
    password: string
}

export interface LoginUser {
    user_name: string,
    password: string
}