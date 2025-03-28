"use client";

import { useState, useEffect } from "react";
import OutputCard from "@/components/OutputCard";
import { getCardInfo } from "@/lib/actions/dealActions";
import { getUserInfo } from "@/lib/actions/userActions";

import type { outputContent } from "@/types/card";

const ViewDeals = () => {
  const [contents, setContents] = useState<outputContent[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const user = await getUserInfo();
      const deals = await getCardInfo(user.id);
      setContents(deals);
      return deals
    };

    fetchData()
    .then((deals) => {
      console.log(deals);
    });

  }, []);

  return (
    <>
      <OutputCard contents={contents} />
      <div className="flex justify-center pt-3">
        <a href="/deals/add">新規作成</a>
      </div>
    </>
  );
};

export default ViewDeals;
