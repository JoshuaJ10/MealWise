import React, { useState } from 'react';
import { MultipleChoiceMessage, useCedarStore, cn } from '@/lib/cedarMock';
import Flat3dButton from '@/cedar/components/containers/Flat3dButton';

interface MultipleChoiceProps {
	message: MultipleChoiceMessage;
}

const MultipleChoice: React.FC<MultipleChoiceProps> = ({ message }) => {
	const { content, choices, multiselect, onChoice } = message;
	const [selected, setSelected] = useState<string[]>([]);
	const store = useCedarStore((state) => state);

	const handleClick = (choice: { label: string; value: string; icon?: React.ReactNode }) => {
		if (multiselect) {
			setSelected((prev) =>
				prev.includes(choice.value)
					? prev.filter((c) => c !== choice.value)
					: [...prev, choice.value]
			);
		} else {
			setSelected([choice.value]);
		}
		if (onChoice) onChoice(choice, store);
	};

	if (!choices || choices.length === 0) return null;

	return (
		<>
			{content && <p className='mb-2 text-sm'>{content}</p>}
			<div className='flex flex-col space-y-2'>
				{choices.map((choice) => {
					const isSelected = selected.includes(choice.value);
					return (
						<Flat3dButton
							key={choice.value}
							onClick={() => handleClick(choice)}
							className={cn(
								'rounded-md px-3 py-2',
								isSelected
									? 'bg-green-100 border border-green-200 text-gray-800'
									: 'bg-white border border-gray-200 text-gray-800'
							)}>
							<div className='text-left'>
								<div className='font-medium'>{choice.label}</div>
							</div>
						</Flat3dButton>
					);
				})}
			</div>
		</>
	);
};

export default MultipleChoice;
