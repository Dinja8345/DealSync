import axios from 'axios';

import { USERS_ENDPOINT } from '@/constants';

import type { newUser, sexTypes } from '@/types/user';

export default async function createUser(state: any, formData: FormData){
    const familyName = formData.get("familyName") as string;
    const firstName = formData.get("firstName") as string;
    const sex = formData.get("sex") as sexTypes;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if(familyName === ""){
      return { msg: "姓が未入力です"};
    }else if(firstName === ""){
      return { msg: "名が未入力です"};
    }else if(email === ""){
      return { msg: "メールアドレスが未入力です"};
    }else if(password === ""){
      return { msg: "パスワードが未入力です"};
    }

    if(password.length < 5){
      return { msg: "パスワードは5字以上である必要があります"};
    }else if(password.length > 32){
      return { msg: "パスワードは32字以下である必要があります"};
    }

    const newUser: newUser = {familyName, firstName, sex, email, password};
    
    try {
        const res = await axios.post(USERS_ENDPOINT, newUser, {
          headers: {
            'Content-Type': 'application/json'
          },
        });
            console.log(res.data);
            return { msg: "登録に成功しました" }
      } catch (e) {
        console.error(e);
        return { msg: "登録に失敗しました" };
      }
}