import { useState, useRef, useEffect } from 'react';
import { Stage, Layer } from 'react-konva';
import Konva from 'konva';

import { Background, ImageObject, Image } from './';

import type { KonvaEventObject } from 'konva/lib/Node';


const Main: React.FC<{ stageRef: React.RefObject<Konva.Stage>; glasses: string[]; tokens: { url: string; name: string; }[]; }> = ({ glasses, tokens, stageRef }) => {
	const [ selectedGlasses, setSelectedGlasses ] = useState<string | null>(null);
	const [ selectedTokenImageURL, setSelectedTokenImageURL ] = useState<string | null>(null);
	const [ selected, setSelected ] = useState<boolean>(true);

	const canvasContainerRef = useRef<HTMLDivElement>(null);


	function onImageMouseDown() {
		if (!selected) setSelected(true);
	}

	function checkDeselect(event: KonvaEventObject<MouseEvent | TouchEvent>) {
		const clickedOnEmpty = event.target === event.target.getStage();

		if (clickedOnEmpty) setSelected(false);
	}


	useEffect(() => {
		Konva.showWarnings = false;
	}, []);


	return (
		<main className={`flex-grow grid ${!selectedTokenImageURL ? 'grid-cols-3' : 'grid-cols-3-auto'} p-6 gap-6 overflow-auto`}>
			<div className={`box ${!selectedTokenImageURL ? 'w-full' : 'w-max'} overflow-hidden`}>
				{!selectedTokenImageURL
					? <div className='flex items-center justify-center h-full'>
						<div className='text-xl'>Select an image</div>
					</div>

					: <div ref={canvasContainerRef} className='h-full'>
						<Stage ref={stageRef} onMouseDown={checkDeselect} onTouchStart={checkDeselect}>
							<Layer draggable={false}>
								<Background src={selectedTokenImageURL} containerRef={canvasContainerRef} />
							</Layer>

							<Layer draggable={true}>
								{selectedGlasses &&
									<ImageObject
										src={`/glasses/${selectedGlasses}.png`}
										selected={selected}
										onMouseDown={onImageMouseDown}
									/>
								}
							</Layer>
						</Stage>
					</div>
				}
			</div>

			<div className='box p-6 overflow-auto'>
				<ul className='flex flex-col items-center gap-10 h-full overflow-y-scroll overflow-x-hidden no-scrollbar'>
					{glasses.map(name => (
						<li
							className='cursor-pointer w-1/2'
							key={name}
							title={name}
							onClick={() => setSelectedGlasses(name.toLowerCase())}
						>
							<img src={`/glasses/${name.toLowerCase()}.png`} alt={name} className='w-full duration-75 hover:scale-95' />
						</li>
					))}
				</ul>
			</div>

			<div className='box p-6 overflow-auto'>
				<ul className='flex flex-col items-center gap-4 h-full overflow-y-scroll overflow-x-hidden no-scrollbar'>
					{tokens.slice(1).map(({ url, name }, i) => (
						<li
							className='w-full'
							key={i}
							title={name}
							onClick={() => setSelectedTokenImageURL(url)}
						>
							<div className='rounded-md overflow-hidden'>
								<Image src={url} alt={`Your Token #${i + 1}`} className='w-full duration-75 cursor-pointer hover:scale-105' />
							</div>
						</li>
					))}
				</ul>
			</div>
		</main>
	);
}


export default Main;