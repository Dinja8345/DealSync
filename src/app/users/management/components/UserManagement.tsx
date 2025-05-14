"use client";

import Image from "next/image";
import UserIcon from "@/components/UserIcon";
import Form from "@/components/Form"; // Form.tsxをインポート
import LoadingIcon from "@/components/LoadingIcon";
import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { uploadImageToS3andDB } from "@/lib/awsS3";
import { getUserInfo, updateUserInfo } from "@/lib/actions/userActions";

const UserManagement = () => {
  const [familyName, setFamilyName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [formMsg, setFormMsg] = useState("");

  // 画像アップロード時のローディングアニメーション管理state
  const [isUploadingImg, setIsUploadingImg] = useState(false);
  const { user, setUser } = useUser();

  // user情報が更新されるたびに、inputのvalueを更新
  useEffect(() => {
    if (user) {
      setFamilyName(user.familyName);
      setFirstName(user.firstName);
      setId(user.id);
      setEmail(user.email);
    }
  }, [user]);

  if (!user) {
    return <div>ログインしてください</div>;
  }

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsUploadingImg(true);
      if (!e.target.files) return;

      const img: File = e.target.files[0];
      if (!img || !user) {
        console.log("imgかuserが存在しません");
      } else {
        //awsに保存するときの画像の名前用uuidを生成
        const uuid = window.crypto.randomUUID();
        //s3にアップロード
        await uploadImageToS3andDB(img, uuid, user.id, user.iconUrl);

        // ブラウザに表示される画像を更新するためにuser情報再取得
        const updatedUser = await getUserInfo();
        setUser(updatedUser);
      }
    } catch (e) {
      console.log(e);
    } finally {
      // ロード中を解除
      setIsUploadingImg(false);
    }
  };

  const handleUpdateUserInfo = async () => {
    if (familyName === "") {
      setFormMsg("姓が未入力です");
      return;
    } else if (firstName === "") {
      setFormMsg("名が未入力です");
      return;
    } else if (id === "") {
      setFormMsg("idが未入力です");
      return;
    } else if (email === "") {
      setFormMsg("メールアドレスが未入力です");
      return;
    }if(!user){
      setFormMsg("ユーザ情報エラー");
      return;
    }

    const result = await updateUserInfo(familyName, firstName, id, email, user._id);

    setFormMsg(result.msg);
    if(result.success){
      const updatedUser = await getUserInfo();
      setUser(updatedUser);
    }
  };

  return (
    <div className="mb-5">
      <div className="flex justify-center relative">
        {isUploadingImg ? (
          <LoadingIcon />
        ) : (
          <>
            <UserIcon
              familyName={user.familyName}
              firstName={user.firstName}
              iconUrl={user.iconUrl}
              custumIconClass={"w-48 h-48 text-6xl"}
              textPadding="px-5"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer absolute bottom-0 rigiht-0 transform translate-x-18 translate-y-1 z-10"
            >
              <div className="bg-gray-200 rounded-full p-2 hover:bg-gray-300">
                {" "}
                <Image src="/edit_pen.svg" alt="edit" width={20} height={20} />
              </div>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUploadImage}
              />
            </label>
          </>
        )}
      </div>
      <div className="flex justify-center mt-3">
        <div className="text-2xl font-bold">
          {user.familyName + " " + user.firstName}
        </div>
      </div>

      {/* ユーザ情報編集Form */}
      <div className="my-8">
        <Form
          title="ユーザー情報編集"
          formClass="max-w-md mx-auto"
          inputContents={[
            {
              id: "familyName",
              name: "苗字",
              inputType: "text",
              placeholder: "例：山田",
              state: { value: familyName, setValue: setFamilyName }, // ダミーのsetValue
            },
            {
              id: "firstName",
              name: "名前",
              inputType: "text",
              placeholder: "例：太郎",
              state: { value: firstName, setValue: setFirstName }, // ダミーのsetValue
            },
            {
              id: "id",
              name: "ID",
              inputType: "text",
              placeholder: "ID",
              state: { value: id, setValue: setId }, // ダミーのsetValue
            },
            {
              id: "email",
              name: "メールアドレス",
              inputType: "email",
              placeholder: "例： example@example.com",
              state: { value: email, setValue: setEmail }, // ダミーのsetValue
            },
          ]}
          btnText="更新する"
          action={handleUpdateUserInfo} // 実際のAPIエンドポイントに置き換える
        />
      </div>
      <div className="flex justify-center">
        <div>
          {formMsg}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
