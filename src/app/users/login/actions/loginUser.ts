"use server"

import axios from 'axios';

import hashPassword from '@/app/users/api/hashPassword';
import verifyPassword from '@/app/users/api/verifyPassword';
import { USERS_ENDPOINT } from '@/constants';

export default async function loginUser(state: any, formData: FormData){
    const email = formData.get("email") as string;
    const inputedPass = formData.get("password") as string;

    const storedUsers = await axios.get(`${USERS_ENDPOINT}?email=${email}`);
    if(storedUsers.data.length == 0){
        return { msg: "そのメールアドレスは登録されていません" }
    }
    
    const storedPass = storedUsers.data[0].password;

    const isMatch: boolean = await verifyPassword(inputedPass,storedPass);
    if(isMatch){
        return { msg: "ログインに成功" };
    }else{
        return { msg: "メールアドレスまたはパスワードが一致していません" };
    }
}

