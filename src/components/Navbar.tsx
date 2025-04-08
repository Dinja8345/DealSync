"use client";

import { useUser } from "@/context/UserContext";
import { userLogout } from "@/lib/actions/userActions";
import { redirect } from "next/navigation";

const Navbar = () => {
  const { user } = useUser();
  
  const logoutUser = async(e: any) => {
    e.preventDefault();
    await userLogout();
    redirect(`/users/logout`);
  }

  const linkClass = "px-3 text-gray-100";
 
  return (
    <>
      <div className="bg-stone-900 w-full h-[70px] py-[20px] px-[50px] box-border fixed inset-x-0 top-0 z-100 flex items-center">
        <div className="flex justify-start">
          <a href="/" className={linkClass}>
            ホーム
          </a>
          <a href="/deals/add" className={linkClass}>
            貸し借り追加
          </a>
          <a href="/deals/view" className={linkClass}>
            貸し借り一覧
          </a>
        </div>
        <div className="ml-auto flex justify-end">
          {user ? (
            <a href="/users/logout" className={linkClass} onClick={logoutUser}>
              ログアウト
            </a>
          ) : (
            <>
              <a href="/users/create" className={linkClass}>
                新規登録
              </a>
              <a href="/users/login" className={linkClass}>
                ログイン
              </a>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
