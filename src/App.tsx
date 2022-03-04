import { useState, useRef, useEffect } from 'react';
import Konva from 'konva';

import { Main } from './components';
import { getNFTsOfAddress } from './lib/functions';


const App: React.FC = () => {
	const [ address, setAddress ] = useState<string>('');
	const [ loading, setLoading ] = useState<boolean>(false);
	const [ glasses, setGlasses ] = useState<string[]>([]);
	const [ tokens, setTokens ] = useState<{ url: string; name: string; }[]>([]);

	const stageRef = useRef<Konva.Stage>(null);


	async function connectWallet() {
		const { ethereum } = window;

		const accounts = await ethereum.request<string[]>({ method: 'eth_requestAccounts' }).catch(() => {});
		if (!accounts || !accounts[0]) return;

		setAddress(accounts[0]);
	}

	function saveImage() {
		const stage = stageRef.current;
		if (!stage) return;


		const objectsToHide = stage.getLayers()[1].getChildren().filter(x => x.getType() !== 'Shape');

		objectsToHide.forEach(object => object.hide());

		const base64 = stage.toDataURL();

		objectsToHide.forEach(object => object.show());

		if (!base64) return alert('error :c');


		const a = document.createElement('a');
			a.style.display = 'none';
			a.download = '!vibe.png';
			a.href = base64;
			a.click();

		a.remove();
	}


	useEffect(() => {
		async function getNFTsOfWallet() {
			setLoading(true);


			const response = await getNFTsOfAddress(address);
			if (!response) return;


			const glasses: string[] = [];
			const tokens: { url: string; name: string; }[] = [];

			for (const token of response) {
				const { contract, metadata, media } = token;

				if (contract.address === import.meta.env.VITE_NOUN_PUNKS_CONTRACT_ADDRESS) {
					if (!metadata?.attributes) continue;

					const trait = metadata.attributes.find(({ trait_type }) => trait_type === 'eye');

					if (trait && !glasses.includes(trait.value)) glasses.push(trait.value);
				} else {
					const image = media?.[0].gateway;

					if (image) tokens.push({ url: image, name: metadata?.name || '...' });
				}
			}


			setTokens(tokens);
			setGlasses(glasses);
			setLoading(false);
		}


		if (address) getNFTsOfWallet();
	}, [address]);


	return (
		<div className='flex flex-col h-screen bg-gray-200'>
			<header className='p-6 pb-0'>
				<div className='box flex items-center justify-between px-4 py-2'>
					<div className='relative'>
						<h1 className='text-5xl cursor-default'>⌐◨-◨</h1>
					</div>

					<div>
						{!address
							? <button className='btn px-4 py-1' onClick={connectWallet}>Connect Wallet</button>

							: <button className='btn px-4 py-1' onClick={saveImage}>Save Image</button>
						}
					</div>
				</div>
			</header>

			{!address
				? <main className='flex-grow flex items-center justify-center'>
					<span className='text-xl'>⌐◨-◨ | Connect your wallet | ⌐◨-◨</span>
				</main>

				: loading ? <main className='flex-grow flex items-center justify-center'>
					<svg xmlns='http://www.w3.org/2000/svg' xmlnsXlink='http://www.w3.org/1999/xlink' width='30%' height='30%' viewBox='0 0 100 100' preserveAspectRatio='xMidYMid'>
						<circle cx='50' cy='50' r='30' stroke='#222326' strokeWidth='7' strokeLinecap='round' fill='none'>
							<animateTransform attributeName='transform' type='rotate' repeatCount='indefinite' dur='1.6s' values='0 50 50;180 50 50;720 50 50' keyTimes='0;0.5;1' />

							<animate attributeName='stroke-dasharray' repeatCount='indefinite' dur='1.6s' values='18 169;94 94;18 169' keyTimes='0;0.5;1'></animate>
						</circle>
					</svg>
				</main>

				: <Main stageRef={stageRef} glasses={glasses} tokens={tokens} />
			}

			<footer className='p-6 pt-0'>
				<div className='box flex items-center justify-between px-4 py-2'>
					<a href='https://opensea.io/collection/nounpunks-eth' target='_blank' className='font-bold'>
						Noun Punks
					</a>

					<a
						href='https://twitter.com/petdomaa100'
						target='_blank'
						className='text-sm text-[#1DA1F2]'
					>
						@petdomaa100
					</a>
				</div>
			</footer>
		</div>
	);
}


export default App;