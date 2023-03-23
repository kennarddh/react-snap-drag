/* eslint-disable security/detect-object-injection */
import useBoxes from 'Hooks/useBoxes'
import { FC, useEffect } from 'react'

import { useDrag } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import { IBoxItem } from 'Types'

import { Container } from './Styles'

const Box: FC<{ id: string }> = ({ id }) => {
	const [, drag, dragPreview] = useDrag<IBoxItem>(() => ({
		type: 'Box',
		item: { id },
	}))

	const { Boxes } = useBoxes()

	useEffect(() => {
		dragPreview(getEmptyImage(), { captureDraggingState: true })
	}, [dragPreview])

	return (
		<Container
			ref={drag}
			style={{
				top: Boxes[id].y - Boxes[id].height / 2,
				left: Boxes[id].x - Boxes[id].width / 2,
				width: Boxes[id].width,
				height: Boxes[id].height,
			}}
		>
			·
		</Container>
	)
}

export default Box
