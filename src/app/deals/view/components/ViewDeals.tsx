"use client"

import { useState, useEffect } from "react";

import { getUserInfo } from "@/lib/actions/userActions";
import OutputCard from '@/components/OutputCard';

import type { outputContent } from "@/types/card";

const ViewDeals = () => {
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

export default ViewDeals;