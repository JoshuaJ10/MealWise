import React from 'react';
import { X } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useCedarStore } from '@/lib/cedarStore';
import { SidePanelContainer } from '@/cedar/components/structural/SidePanelContainer';
import { CollapsedButton } from '@/cedar/components/chatMessages/structural/CollapsedChatButton';
import { ChatInput } from '@/cedar/components/chatInput/ChatInput';
import ChatBubbles from '@/cedar/components/chatMessages/ChatBubbles';
import Container3D from '@/cedar/components/containers/Container3D';
import { GroceryCedarChat } from './GroceryCedarChat';

interface GrocerySidePanelProps {
	children?: React.ReactNode;
	side?: 'left' | 'right';
	title?: string;
	collapsedLabel?: string;
	showCollapsedButton?: boolean;
	companyLogo?: React.ReactNode;
	dimensions?: {
		width?: number;
		minWidth?: number;
		maxWidth?: number;
	};
	resizable?: boolean;
	className?: string;
	topOffset?: number;
	stream?: boolean;
}

export const GrocerySidePanel: React.FC<GrocerySidePanelProps> = ({
	children,
	side = 'right',
	title = 'Grocery Copilot',
	collapsedLabel = 'Ask me to plan your shopping!',
	showCollapsedButton = true,
	companyLogo,
	dimensions = {
		width: 500,
		minWidth: 400,
		maxWidth: 600,
	},
	resizable = true,
	className = '',
	topOffset = 0,
	stream = true,
}) => {
	const showChat = useCedarStore((state) => state.showChat);
	const setShowChat = useCedarStore((state) => state.setShowChat);

	return (
		<>
			{showCollapsedButton && (
				<AnimatePresence mode='wait'>
					{!showChat && (
						<CollapsedButton
							side={side}
							label={collapsedLabel}
							onClick={() => setShowChat(true)}
							layoutId='grocery-sidepanel-chat'
							position='fixed'
						/>
					)}
				</AnimatePresence>
			)}

			<SidePanelContainer
				isActive={showChat}
				side={side}
				dimensions={dimensions}
				resizable={resizable}
				topOffset={topOffset}
				panelClassName={`dark:bg-gray-900 ${className}`}
				panelContent={
					<Container3D className='flex flex-col h-full'>
						{/* Header */}
						<div className='flex-shrink-0 z-20 flex flex-row items-center justify-between px-4 py-2 min-w-0 border-b border-gray-200 dark:border-gray-700'>
							<div className='flex items-center min-w-0 flex-1'>
								{companyLogo && (
									<div className='flex-shrink-0 w-6 h-6 mr-2'>
										{companyLogo}
									</div>
								)}
								<span className='font-bold text-lg truncate'>{title}</span>
							</div>
							<div className='flex items-center gap-2 flex-shrink-0'>
								<button
									className='p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors'
									onClick={() => setShowChat(false)}
									aria-label='Close chat'>
									<X className='h-4 w-4' strokeWidth={2.5} />
								</button>
							</div>
						</div>

						{/* Grocery-specific chat interface */}
						<div className='flex-1 min-h-0 overflow-hidden flex flex-col'>
							<GroceryCedarChat className='flex-1' />
							
							{/* Chat messages - takes up remaining space */}
							<div className='flex-1 min-h-0 overflow-hidden'>
								<ChatBubbles />
							</div>

							{/* Chat input - fixed at bottom */}
							<div className='flex-shrink-0 p-3'>
								<ChatInput
									handleFocus={() => {}}
									handleBlur={() => {}}
									isInputFocused={false}
									stream={stream}
								/>
							</div>
						</div>
					</Container3D>
				}>
				{/* Page content that gets squished when panel opens */}
				{children}
			</SidePanelContainer>
		</>
	);
};
