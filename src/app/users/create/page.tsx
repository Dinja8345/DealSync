"use client"

import { useEffect } from 'react';

import getUserInfo from '@/lib/getUserInfo';
import CreateUsers from '@/app/users/create/components/CreateUsers';

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
