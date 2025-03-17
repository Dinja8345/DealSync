"use client"

import { useState, useEffect } from "react";

import OutputCard from '@/components/OutputCard';
import getCardInfo from '@/app/transactions/view/api/getCardCardInfo';

import type { outputContent } from "@/types/card";

const ViewTransactions = () => {
	const [ contents, setContents ] = useState<outputContent[]>([]);
	
	useEffect(() => {
		getCardInfo()
		.then((data) => {
			setContents(data);
		}).catch((err) => {
			throw err;
		})
	}, []);

	return (
		<>
			<OutputCard contents={contents} />
		</>
	)
}

export default ViewTransactions;