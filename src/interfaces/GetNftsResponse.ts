interface NftMedia {
    uri?: {
        raw: string;
        gateway: string;
    };
}

interface NftMetadata extends Record<string, any> {
    name?: string;
    description?: string;
    image?: string;
    attributes?: Array<Record<string, any>>;
}

interface BaseNft {
    contract: {
        address: string;
    };
    id: {
        tokenId: string;
        tokenMetadata?: {
            tokenType: 'erc721' | 'erc1155';
        };
    };
}

interface Nft extends BaseNft {
    title: string;
    description: string;
    tokenUri?: {
        raw: string;
        gateway: string;
    };
    media?: NftMedia[];
    metadata?: NftMetadata;
    timeLastUpdated: string;
}

interface GetNftsResponse {
    ownedNfts: Nft[];
    pageKey?: string;
    totalCount: number;
}


export default GetNftsResponse;