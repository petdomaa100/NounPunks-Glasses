import { useState, useRef, useEffect } from 'react';
import { Image, Transformer } from 'react-konva';
import Konva from 'konva';

import type { ShapeConfig } from 'konva/lib/Shape';
import type { Box } from 'konva/lib/shapes/Transformer';
import { KonvaEventObject } from 'konva/lib/Node';


const ImageObject: React.FC<ShapeConfig | { src: string; selected: boolean; onSelect: (event: KonvaEventObject<MouseEvent>) => void; onMouseDown: (event: KonvaEventObject<MouseEvent>) => void; }> = ({ src, selected, onSelect, onMouseDown, ...rest }) => {
	const [ image, setImage ] = useState<CanvasImageSource>();

	const imageRef = useRef<HTMLImageElement>();
	const shapeRef = useRef<Konva.Image>(null);
	const transformerRef = useRef<Konva.Transformer>(null);


	function loadImage() {
		const img = new window.Image();
		img.src = src;
		img.crossOrigin = 'Anonymous';
		imageRef.current = img;

		imageRef.current.addEventListener('load', handleLoad);
	}

	function handleLoad() {
		setImage(imageRef.current);

		const shape = shapeRef.current;
		const stage = shape?.getStage();
		if (!shape || !stage) return;


		const k = (stage.width() / 6) / shape.getHeight();

		shape.width(shape.getWidth() * k);
		shape.height(shape.getHeight() * k);

		shape.x(stage.width() / 2 - shape.width() / 2);
		shape.y(stage.height() / 2 - shape.height() / 2);
	}

	function boundBoxFuncHandler(oldBox: Box, newBox: Box) {
		if (newBox.width < 10 || newBox.height < 10) return oldBox;
		else return newBox;
	}


	useEffect(() => {
		loadImage();

		return () => imageRef.current?.removeEventListener('load', handleLoad);
	}, []);

	useEffect(() => loadImage(), [src]);

	useEffect(() => {
		if (!selected || !transformerRef.current || !shapeRef.current) return;

		transformerRef.current.nodes([ shapeRef.current ]);
		transformerRef.current.getLayer()?.batchDraw();
	}, [selected]);


	return (
		<>
			<Image
				ref={shapeRef}
				{...rest}
				image={image}
				onClick={onSelect}
				onMouseDown={onMouseDown}
				onTap={onSelect}
			/>

			{selected &&
				<Transformer
					ref={transformerRef}
					boundBoxFunc={boundBoxFuncHandler}
					anchorSize={10}
					anchorStroke={'black'}
					borderStroke={'black'}
				/>
			}
		</>
	);
}


export default ImageObject;