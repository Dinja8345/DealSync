"use client"

import { useEffect } from 'react';

import { getUserInfo } from '@/lib/actions/userActions';
import CreateUsers from '@/app/users/signup/components/CreateUsers';

export default function Home() {
  useEffect(() => {
    const user = getUserInfo();
    console.log(user);
  }, []);
  
  return (
    <>
      <p>アカウント作成画面</p>
      <CreateUsers />
      <a href="login">ログインページ</a>
    </>
  );
}
