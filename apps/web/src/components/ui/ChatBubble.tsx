interface ChatBubbleProps {
	text: string
	isUser: boolean
	timestamp: string
}

export function ChatBubble({ text, isUser, timestamp }: ChatBubbleProps) {
	return (
		<div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
			<div
				className={`max-w-[80%] p-4 rounded-2xl font-body-md leading-relaxed ${
					isUser ? "bg-primary text-on-primary rounded-br-sm" : "bg-surface-container text-on-surface rounded-bl-sm"
				}`}
			>
				{text}
			</div>
			<span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider mt-2 px-2">
				{timestamp}
			</span>
		</div>
	)
}
