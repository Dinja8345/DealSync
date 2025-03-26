"use client"

import { useState, useEffect } from "react";

import getUserInfo from "@/lib/getUserInfo";
import OutputCard from '@/components/OutputCard';

import type { outputContent } from "@/types/card";

const ViewTransactions = () => {
	const [ contents, setContents ] = useState<outputContent[]>([]);
	
	useEffect(() => {
		const user = getUserInfo();
	}, []);

	return (
		<>
			<OutputCard contents={contents} />
		</>
	)
}

export default ViewTransactions;