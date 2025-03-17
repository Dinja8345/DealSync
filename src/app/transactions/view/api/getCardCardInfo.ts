import axios from 'axios';

import { CARDS_ENDPOINT } from '@/constants';

import type { outputContent } from '@/types/card';

const getCardInfo = async() => {
  const originDatasPromiss = await axios.get(CARDS_ENDPOINT);
  const datas : outputContent[] = [];
  originDatasPromiss.data.map((data : any) => {
    const newData : outputContent = {
      format: data.format,
      name: data.name,
      money: data.money,
      status: "未返済",
      dueDate: data.dueDate,
      memo: data.memo,
      id: data.id,
    }
    datas.push(newData);
  })
  return datas;
}

export default getCardInfo;