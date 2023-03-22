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

			const endX = x + width
			const endY = y + height

			const centerX = x + width / 2
			const centerY = y + height / 2

			const boxesEntries = Object.entries(BoxesRef.current).filter(
				([id]) => id !== item.id
			)

			const nearCenter = boxesEntries
				.filter(([, box]) => {
					const targetCenterX = box.x + box.width / 2
					const targetCenterY = box.y + box.height / 2

					return (
						centerX >= targetCenterX - snapDistance &&
						centerX <= targetCenterX + snapDistance &&
						centerY >= targetCenterY - snapDistance &&
						centerY <= targetCenterY + snapDistance
					)
				})
				.sort(
					(a, b) => a[1].x + a[1].width / 2 - b[1].x + b[1].width / 2
				)[0] as [string, IBox] | undefined

			const nearX = boxesEntries
				.filter(([, box]) => {
					return (
						box.x + box.width <= x + snapDistance &&
						box.x + box.width >= x - snapDistance &&
						box.y >= y - snapDistance &&
						box.y <= y + snapDistance
					)
				})
				.sort(
					(a, b) => a[1].x + a[1].width / 2 - b[1].x + b[1].width / 2
				)[0] as [string, IBox] | undefined

			const nearEndX = boxesEntries
				.filter(([, box]) => {
					return (
						box.x >= endX - snapDistance &&
						box.x <= endX + snapDistance &&
						box.y >= y - snapDistance &&
						box.y <= y + snapDistance
					)
				})
				.sort(
					(a, b) => a[1].x + a[1].width / 2 - b[1].x + b[1].width / 2
				)[0] as [string, IBox] | undefined

			const nearY = boxesEntries
				.filter(([, box]) => {
					return (
						box.y + box.height <= y + snapDistance &&
						box.y + box.height >= y - snapDistance &&
						box.x >= x - snapDistance &&
						box.x <= x + snapDistance
					)
				})
				.sort(
					(a, b) =>
						a[1].y + a[1].height / 2 - b[1].y + b[1].height / 2
				)[0] as [string, IBox] | undefined

			const nearEndY = boxesEntries
				.filter(([, box]) => {
					return (
						box.y >= endY - snapDistance &&
						box.y <= endY + snapDistance &&
						box.x >= x - snapDistance &&
						box.x <= x + snapDistance
					)
				})
				.sort(
					(a, b) =>
						a[1].y + a[1].height / 2 - b[1].y + b[1].height / 2
				)[0] as [string, IBox] | undefined

			console.log({ nearCenter, nearX, nearEndX, nearY, nearEndY })

			if (nearCenter) {
				UpdateBox(item.id, { x: nearCenter[1].x, y: nearCenter[1].y })

				return
			}

			if (nearX) {
				UpdateBox(item.id, {
					x: nearX[1].x + nearX[1].width,
					y: nearX[1].y,
				})

				return
			}

			if (nearEndX) {
				UpdateBox(item.id, prev => ({
					x: nearEndX[1].x - prev.width,
					y: nearEndX[1].y,
				}))

				return
			}

			if (nearY) {
				UpdateBox(item.id, {
					x: nearY[1].x,
					y: nearY[1].y + nearY[1].height,
				})

				return
			}

			if (nearEndY) {
				UpdateBox(item.id, {
					x: nearEndY[1].x,
					y: nearEndY[1].y - nearEndY[1].height,
				})

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
