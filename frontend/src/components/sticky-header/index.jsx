export default function StickyHeader({ title, children }) {
	return (
		<div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md">
			<div className="flex h-[53px] items-center px-4">
				<h2 className="text-xl font-bold text-white">{title}</h2>
			</div>
			{children}
		</div>
	)
} 