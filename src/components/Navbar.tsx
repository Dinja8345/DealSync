"use client";

import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { userLogout } from "@/lib/actions/userActions";
import { redirect } from "next/navigation";
import { Menu, X } from "lucide-react";
import { div } from "framer-motion/client";

const Navbar = () => {
  const { user } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isProfileMenuOpen, isSetProfileMenuOpen] = useState(false);

  const logoutUser = async (e: any) => {
    e.preventDefault();
    await userLogout();
    redirect(`/users/logout`);
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleProfileMenu = () => isSetProfileMenuOpen(!isProfileMenuOpen);

  const linkClass = "block px-4 py-2 text-gray-100 hover:bg-stone-700 rounded";
  const iconClass = "w-12 h-12 rounded-full object-cover cursor-pointer"; // 48px に拡大

  return (
    <>
      {/* ナビゲーションバー */}
      <nav className="bg-stone-900 fixed w-full top-0 left-0 z-40">
        <div className="max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* 左側：タイトル */}
          <div className="text-white text-xl font-bold">DealSync</div>

          {/* PCメニュー（画面右85%） */}
          <div className="hidden md:flex w-[85%] justify-between items-center">
            <div className="flex space-x-4">
              <a href="/" className={linkClass}>
                ホーム
              </a>
              <a href="/deals/add" className={linkClass}>
                貸し借り追加
              </a>
              <a href="/deals/view" className={linkClass}>
                貸し借り一覧
              </a>
              <a href="/users/friends" className={linkClass}>
                フレンド管理
              </a>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="relative">
                  <img
                    src={user.iconUrl}
                    alt="ユーザーアイコン"
                    className={iconClass}
                    onClick={toggleProfileMenu}
                  />
                  {isProfileMenuOpen && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-stone-800 rounded shadow-lg z-50 min-w-[140px] py-2">
                      <a
                        href="/users/manegement"
                        className={linkClass}
                        onClick={() => {
                          isSetProfileMenuOpen(false);
                        }}
                      >
                        ユーザ管理
                      </a>
                      <a
                        href="/users/logout"
                        className={linkClass}
                        onClick={(e) => {
                          logoutUser(e);
                          isSetProfileMenuOpen(false);
                        }}
                      >
                        ログアウト
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <a href="/users/signup" className={linkClass}>
                    新規登録
                  </a>
                  <a href="/users/login" className={linkClass}>
                    ログイン
                  </a>
                </>
              )}
            </div>
          </div>

          {/* ハンバーガーボタン（モバイル用） */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-white">
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* モバイルメニュー（上からスライド） */}
      <div
        className={`fixed top-0 left-0 w-full bg-stone-900 text-white z-30 transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="p-4">
          <div className="flex justify-end">
            <button onClick={toggleMenu}>
              <X size={24} />
            </button>
          </div>
          <div className="flex flex-col space-y-4 mt-4">
            <a href="/" className={linkClass} onClick={toggleMenu}>
              ホーム
            </a>
            <a href="/deals/add" className={linkClass} onClick={toggleMenu}>
              貸し借り追加
            </a>
            <a href="/deals/view" className={linkClass} onClick={toggleMenu}>
              貸し借り一覧
            </a>
            <a href="/users/friends" className={linkClass} onClick={toggleMenu}>
              フレンド管理
            </a>
            {user ? (
              <a
                href="/users/logout"
                className={linkClass}
                onClick={(e) => {
                  logoutUser(e);
                  toggleMenu();
                }}
              >
                ログアウト
              </a>
            ) : (
              <>
                <a
                  href="/users/signup"
                  className={linkClass}
                  onClick={toggleMenu}
                >
                  新規登録
                </a>
                <a
                  href="/users/login"
                  className={linkClass}
                  onClick={toggleMenu}
                >
                  ログイン
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 背景の暗転（メニュー表示中のみ） */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-20"
          onClick={toggleMenu}
        />
      )}
    </>
  );
};

export default Navbar;
