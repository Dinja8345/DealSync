"use client"

import { useState, useEffect } from "react";

import OutputCard from '@/components/OutputCard';
import getCardInfo from '@/app/transactions/view/api/card';

import type { outputContent } from "@/types/card";

const ViewTransactions = () => {
	const [ contents, setContents ] = useState<outputContent[]>([]);
	
	useEffect(() => {
		getCardInfo()
		.then((data) => {
			setContents(data);
			console.log(data);
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