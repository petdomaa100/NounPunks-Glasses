import type { GetNftsResponse } from '../interfaces';


const alchemyBaseURL = `https://eth-mainnet.alchemyapi.io/v2/${import.meta.env.VITE_ALCHEMY_API_KEY}`;


async function httpGet<T>(url: string): Promise<T | null> {
	try {
		const response = await fetch(url);
		const json = await response.json();

		return json;
	} catch (err: any) {
		console.log(`HTTP GET Error: "${err.message}"`);
	}

	return null;
}

async function getNFTsOfAddress(address: string) {
	const response = await httpGet<GetNftsResponse>(`${alchemyBaseURL}/getNFTs?owner=${address}`);
	if (!response) return null;

	const { ownedNfts, totalCount } = response;

	let pageKey = response.pageKey;

	while (totalCount > ownedNfts.length) {
		const response = await httpGet<GetNftsResponse>(`${alchemyBaseURL}/getNFTs?owner=${address}&pageKey=${pageKey}`);
		if (!response) return null;

		ownedNfts.push(...response.ownedNfts);

		pageKey = response.pageKey;
	}


	return ownedNfts;
}



export {
	httpGet,
	getNFTsOfAddress
};