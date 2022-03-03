import { Fragment, useState } from 'react';


const Image: React.FC<{ imageURL: string; alt: string; style: string; }> = ({ imageURL, alt, style }) => {
	const [ loaded, setLoaded ] = useState(false);


	function onImageLoaded() {
		setLoaded(true);
	}


	return (
		<Fragment>
			{!loaded &&
				<div className='flex items-center justify-center h-full w-full'>
					<svg xmlns='http://www.w3.org/2000/svg' xmlnsXlink='http://www.w3.org/1999/xlink' width='40%' height='40%' viewBox='0 0 100 100' preserveAspectRatio='xMidYMid'>
						<circle cx='50' cy='50' r='30' stroke='#222326' strokeWidth='8' strokeLinecap='round' fill='none'>
							<animateTransform attributeName='transform' type='rotate' repeatCount='indefinite' dur='1.6s' values='0 50 50;180 50 50;720 50 50' keyTimes='0;0.5;1' />

							<animate attributeName='stroke-dasharray' repeatCount='indefinite' dur='1.6s' values='18 169;94 94;18 169' keyTimes='0;0.5;1'></animate>
						</circle>
					</svg>
				</div>
			}

			<img src={imageURL} alt={alt} className={!loaded ? 'hidden' : style} onLoad={onImageLoaded} />
		</Fragment>
	);
}


export default Image;