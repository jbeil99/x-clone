export default function StickyHeader({ title, children }) {
	return (
		<div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md dark:bg-black/80">
			<div className="flex h-[53px] items-center px-4">
				<h2 className="text-xl font-bold">{title}</h2>
			</div>
			{children}
		</div>
	)
} 