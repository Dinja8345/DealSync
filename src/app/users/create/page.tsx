import CreateUsers from '@/app/users/create/components/CreateUsers';

export default function Home() {
  return (
    <>
      <p>アカウント作成画面</p>
      <CreateUsers />
      <a href="login">ログインページ</a>
    </>
  );
}
