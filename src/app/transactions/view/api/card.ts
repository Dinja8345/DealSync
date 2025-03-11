import axios from 'axios';

import { ENDPOINT } from '@/constants';

import type { outputContent } from '@/types/card';

const getCardInfo = async() => {
  const originDatasPromiss = await axios.get(ENDPOINT);
  const datas : outputContent[] = [];
  originDatasPromiss.data.map((data : any) => {
    const newData : outputContent = {
      format: data.format,
      name: data.name,
      money: data.money,
      dueDate: data.dueDate,
      id: data.id,
    }
    datas.push(newData);
  })
  return datas;
}

export default getCardInfo;