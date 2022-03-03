import { useState, useRef, useEffect } from 'react';
import { Image } from 'react-konva';
import Konva from 'konva';


const Background: React.FC<{ src: string; containerRef: React.RefObject<HTMLDivElement>; }> = ({ src, containerRef }) => {
	const [ image, setImage ] = useState<CanvasImageSource>();

	const imageRef = useRef<HTMLImageElement>();
	const shapeRef = useRef<Konva.Image>(null);


	function loadImage() {
		const img = new window.Image();
		img.src = src;
		img.crossOrigin = 'Anonymous';
		imageRef.current = img;

		imageRef.current.addEventListener('load', handleLoad);
	}

	function handleLoad() {
		setImage(imageRef.current);

		adjustBackgroundSize();
		window.addEventListener('resize', adjustBackgroundSize);
	}

	function adjustBackgroundSize() {
		const image = shapeRef.current;
		const container = containerRef.current;
		const stage = image?.getStage();
		
		if (!image || !container || !stage) return;


		const k = container.clientHeight / image.getHeight();

		image.width(image.getWidth() * k);
		image.height(container.clientHeight);

		stage.width(image.getWidth());
		stage.height(container.clientHeight);
	}



	useEffect(() => {
		loadImage();

		return () => imageRef.current?.removeEventListener('load', handleLoad);
	}, []);

	useEffect(() => loadImage(), [src]);


	return <Image ref={shapeRef} image={image} listening={false} />;
}


export default Background;