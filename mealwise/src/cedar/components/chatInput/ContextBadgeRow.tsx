import {
	ContextEntry,
	useCedarStore,
	withClassName,
	type CedarEditor as Editor,
} from '@/lib/cedarMock';
import { X } from 'lucide-react';
import React from 'react';

/**
 * Helper to normalize context entries to an array for internal processing
 */
function normalizeToArray(
	value: ContextEntry | ContextEntry[]
): ContextEntry[] {
	return Array.isArray(value) ? value : [value];
}

interface ContextBadgeRowProps {
	editor?: Editor | null;
}

export const ContextBadgeRow: React.FC<ContextBadgeRowProps> = ({ editor }) => {
	const removeContextEntry = useCedarStore((s) => s.removeContextEntry) as (key: string) => void;
	const mentionProviders = useCedarStore((s) => s.mentionProviders) as Map<string, unknown>;
	const additionalContext = useCedarStore((s) => s.additionalContext) as Map<string, unknown>;
	const collapsingConfigs = useCedarStore((s) => s.collapsingConfigs) as Map<string, unknown>;

	const renderContextBadge = (key: string, entry: ContextEntry) => {
		// Try to find a provider that might have created this entry
		const provider = mentionProviders.get(key) as { renderContextBadge?: (entry: ContextEntry) => React.ReactNode };

		// Respect visibility flag
		if (entry.metadata?.showInChat === false) {
			return null;
		}

		// Use custom renderer if available
		if (provider?.renderContextBadge) {
			return provider.renderContextBadge(entry);
		}

		// Get the label from metadata or fall back to id
		const label = entry.metadata?.label || entry.id;

		// Get color from metadata and apply 20% opacity
		const color = entry.metadata?.color;
		const bgStyle = color ? { backgroundColor: `${color}33` } : {}; // 33 in hex = 20% opacity
		const hasBgStyle = !!color;

		return (
			<div
				key={key + ':' + entry.id}
				className={`px-2 py-1 text-xs rounded-sm cursor-pointer flex items-center gap-1 whitespace-nowrap hover:border-opacity-80 hover:text-opacity-80 group box-border border ${
					hasBgStyle ? 'border-transparent' : ''
				}`}
				style={bgStyle}
				tabIndex={0}
				aria-label={`Selected ${key} ${label}`}
						onClick={() => {
							if (entry.source === 'mention') {
								removeContextEntry(key);
								// Also remove the mention from the editor
								if (editor && editor.state) {
									const { state } = editor;
									const { doc, tr } = state as { doc: { descendants: (callback: (node: unknown, pos: number) => void) => void }; tr: unknown };
									let found = false;

									doc.descendants((node, pos) => {
										const nodeObj = node as { type: { name: string }; attrs: { contextEntryId: string }; nodeSize: number };
										if (
											nodeObj.type.name === 'mention' &&
											nodeObj.attrs.contextEntryId === entry.id
										) {
											const trObj = tr as { delete: (start: number, end: number) => void };
											trObj.delete(pos, pos + nodeObj.nodeSize);
									found = true;
									return false;
								}
							});

									if (found && editor.view) {
										editor.view.dispatch(tr);
									}
						}
					}
				}}>
								{entry.metadata?.icon && entry.source === 'mention' && (
									<>
										<span className='flex-shrink-0 group-hover:hidden'>
											{React.createElement(withClassName(entry.metadata.icon as React.ComponentType<unknown>, 'w-3 h-3'))}
										</span>
										<X className='w-3 h-3 flex-shrink-0 hidden group-hover:block' />
									</>
								)}
				{entry.metadata?.icon && entry.source !== 'mention' && (
					<span className='flex-shrink-0'>
						{React.createElement(withClassName(entry.metadata.icon as React.ComponentType<unknown>, 'w-3 h-3'))}
					</span>
				)}
				{!entry.metadata?.icon && entry.source === 'mention' && (
					<X className='w-3 h-3 flex-shrink-0 hidden group-hover:block' />
				)}
				<span>{label}</span>
			</div>
		);
	};

	// Process and render context with collapsing logic
	const contextElements = React.useMemo(() => {
		const elements: React.ReactNode[] = [];

		// Create a sorted list of context keys based on their entries' order metadata
				if (additionalContext) {
					const contextKeysWithOrder = Array.from(additionalContext.keys()).map((key) => {
						const value = additionalContext.get(key) as ContextEntry | ContextEntry[] | undefined;
						const entries = normalizeToArray(value || []);
			// Get the minimum order value from entries for this key (or MAX if none)
			const minOrder = entries.reduce((min: number, entry: ContextEntry) => {
				const order = entry.metadata?.order;
				return order !== undefined ? Math.min(min, order) : min;
			}, Number.MAX_SAFE_INTEGER);

			return { key, order: minOrder, entries };
		});

		// Sort keys by their order
		contextKeysWithOrder.sort((a, b) => a.order - b.order);

		// Process each key with collapsing logic
		contextKeysWithOrder.forEach(({ key, entries }) => {
			if (!entries.length) return;

			// Filter visible entries
			const visibleEntries = entries.filter(
				(entry) => entry.metadata?.showInChat !== false
			);
			const hiddenEntries = entries.filter(
				(entry) => entry.metadata?.showInChat === false
			);

			// Check for collapsing configuration from store
			const keyCollapseConfig = collapsingConfigs.get(key) as { threshold?: number; label?: string; icon?: React.ComponentType<unknown> } | undefined;

			// Apply collapsing if configured and threshold exceeded
			if (
				keyCollapseConfig &&
				visibleEntries.length > (keyCollapseConfig.threshold || 3)
			) {
				const firstEntry = entries[0];
				// Create collapsed badge
				const collapsedLabel =
					keyCollapseConfig.label?.replace(
						'{count}',
						visibleEntries.length.toString()
					) || `${visibleEntries.length} Selected`;

				const collapsedEntry: ContextEntry = {
					id: `${key}-collapsed`,
					source: 'subscription',
					data: visibleEntries.map((e) => e.data),
					metadata: {
						label: collapsedLabel,
						icon: keyCollapseConfig.icon || firstEntry?.metadata?.icon,
						color: firstEntry?.metadata?.color,
						showInChat: true,
						isCollapsed: true,
						originalCount: visibleEntries.length,
					},
				};

				// Render the collapsed badge
				elements.push(renderContextBadge(key, collapsedEntry));

				// Render any hidden entries individually
				hiddenEntries.forEach((entry) => {
					elements.push(renderContextBadge(key, entry));
				});
			} else {
				entries.forEach((entry) => {
					elements.push(renderContextBadge(key, entry));
				});
			}
		});

		return elements;
	}}, [
		additionalContext,
		mentionProviders,
		collapsingConfigs,
		renderContextBadge,
	]);

	return (
		<div id='input-context' className='flex items-center gap-2 flex-wrap'>
			<div
				className={`px-2 py-1 text-xs rounded-sm flex items-center gap-1 whitespace-nowrap dark:bg-gray-800 bg-gray-50 box-border border border-transparent`}>
				<span>@ to add context</span>
			</div>
			{contextElements}
		</div>
	);
};
