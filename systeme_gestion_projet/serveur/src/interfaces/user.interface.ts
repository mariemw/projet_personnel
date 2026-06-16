export interface User{
    userName:string,
    password:string,
    email:string,
    isVerified?:boolean,
    verificationToken?:string,
    tokenExpiredAt?:Date
}