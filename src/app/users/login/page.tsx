import UserLogin from '@/app/users/login/components/UserLogin';

export default function Home() {
  return (
    <>
      <UserLogin />
      <a href="create">アカウント作成ページ</a>
    </>
  );
}
