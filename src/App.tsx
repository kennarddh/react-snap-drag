import { FC, useRef } from 'react'

import { useDrop, XYCoord } from 'react-dnd'

import Box from 'Components/Box/Box'

import useBoxes from 'Hooks/useBoxes'

import { IBoxItem } from 'Types'

import { Container } from './AppStyles'
import { IBox } from 'Contexts/Boxes'

const App: FC = () => {
	const PrevDeltaRef = useRef<XYCoord | null>(null)

	const { Boxes, BoxesRef, UpdateBox } = useBoxes()

	const [, drop] = useDrop<IBoxItem>(() => ({
		accept: 'Box',
		hover(item, monitor) {
			const delta = monitor.getDifferenceFromInitialOffset()

			const deltaX = delta?.x ?? 0
			const deltaY = delta?.y ?? 0

			const prevDeltaX = PrevDeltaRef.current?.x ?? 0
			const prevDeltaY = PrevDeltaRef.current?.y ?? 0

			UpdateBox(item.id, prev => ({
				y: prev.y + deltaY - prevDeltaY,
				x: prev.x + deltaX - prevDeltaX,
			}))

			PrevDeltaRef.current = { x: deltaX, y: deltaY }
		},
		drop(item) {
			PrevDeltaRef.current = { x: 0, y: 0 }

			const snapDistance = 15

			const { x, y, width, height } = BoxesRef.current[item.id]

			const boxesEntries = Object.entries(BoxesRef.current).filter(
				([id]) => id !== item.id
			)

			const nearCenter = boxesEntries
				.filter(([, box]) => {
					return (
						x >= box.x - snapDistance &&
						x <= box.x + snapDistance &&
						y >= box.y - snapDistance &&
						y <= box.y + snapDistance
					)
				})
				.sort((a, b) => a[1].x - b[1].x)[0] as
				| [string, IBox]
				| undefined

			const nearX = boxesEntries
				.filter(([, box]) => {
					return (
						box.x + box.width / 2 <= x - width / 2 + snapDistance &&
						box.x + box.width / 2 >= x - width / 2 - snapDistance &&
						box.y >= y - snapDistance &&
						box.y <= y + snapDistance
					)
				})
				.sort((a, b) => a[1].x - b[1].x)[0] as
				| [string, IBox]
				| undefined

			const nearEndX = boxesEntries
				.filter(([, box]) => {
					return (
						box.x - box.width / 2 >= x + width / 2 - snapDistance &&
						box.x - box.width / 2 <= x + width / 2 + snapDistance &&
						box.y >= y - snapDistance &&
						box.y <= y + snapDistance
					)
				})
				.sort((a, b) => a[1].x - b[1].x)[0] as
				| [string, IBox]
				| undefined

			const nearY = boxesEntries
				.filter(([, box]) => {
					return (
						box.y + box.height / 2 <=
							y - height / 2 + snapDistance &&
						box.y + box.height / 2 >=
							y - height / 2 - snapDistance &&
						box.x >= x - snapDistance &&
						box.x <= x + snapDistance
					)
				})
				.sort((a, b) => a[1].y - b[1].y)[0] as
				| [string, IBox]
				| undefined

			const nearEndY = boxesEntries
				.filter(([, box]) => {
					return (
						box.y - box.height / 2 <=
							y + height / 2 + snapDistance &&
						box.y - box.height / 2 >=
							y + height / 2 - snapDistance &&
						box.x >= x - snapDistance &&
						box.x <= x + snapDistance
					)
				})
				.sort((a, b) => a[1].y - b[1].y)[0] as
				| [string, IBox]
				| undefined

			if (nearCenter) {
				UpdateBox(item.id, {
					x: nearCenter[1].x,
					y: nearCenter[1].y,
				})

				return
			}

			if (nearX) {
				UpdateBox(item.id, prev => ({
					x: nearX[1].x + nearX[1].width / 2 + prev.width / 2,
					y: nearX[1].y,
				}))

				return
			}

			if (nearEndX) {
				UpdateBox(item.id, prev => ({
					x: nearEndX[1].x - prev.width / 2 - nearEndX[1].width / 2,
					y: nearEndX[1].y,
				}))

				return
			}

			if (nearY) {
				UpdateBox(item.id, prev => ({
					x: nearY[1].x,
					y: nearY[1].y + nearY[1].height / 2 + prev.height / 2,
				}))

				return
			}

			if (nearEndY) {
				UpdateBox(item.id, prev => ({
					x: nearEndY[1].x,
					y: nearEndY[1].y - nearEndY[1].height / 2 - prev.height / 2,
				}))

				return
			}
		},
	}))

	return (
		<Container ref={drop}>
			{Object.keys(Boxes).map(id => (
				<Box key={id} id={id} />
			))}
		</Container>
	)
}

export default App
