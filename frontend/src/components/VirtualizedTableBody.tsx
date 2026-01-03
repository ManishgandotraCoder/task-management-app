import { useEffect, useRef, useState, type ReactNode } from 'react';
import { TableBody } from '@/components/ui/table';

interface VirtualizedTableBodyProps<T> {
    items: T[];
    renderRow: (item: T, index: number) => ReactNode;
    rowHeight: number;
    containerHeight?: number;
    overscan?: number;
    className?: string;
    getRowProps?: (item: T, index: number) => React.HTMLAttributes<HTMLTableRowElement>;
    onLoadMore?: () => void;
    hasMore?: boolean;
}

/**
 * A virtualized table body component that only renders visible rows.
 * Works seamlessly with the existing Table components.
 * 
 * Supports bidirectional virtualization - efficiently handles scrolling
 * both upward and downward by only rendering visible rows plus overscan.
 * 
 * The Table component wraps the table in a div with overflow-auto, 
 * so this component listens to scroll events from that container.
 */
export function VirtualizedTableBody<T>({
    items,
    renderRow,
    rowHeight,
    containerHeight,
    overscan = 3,
    className = '',
    getRowProps,
    onLoadMore,
    hasMore = false,
}: VirtualizedTableBodyProps<T>) {
    const [scrollTop, setScrollTop] = useState(0);
    const [containerSize, setContainerSize] = useState(containerHeight || 400);
    const tbodyRef = useRef<HTMLTableSectionElement>(null);
    const resizeObserverRef = useRef<ResizeObserver | null>(null);
    const scrollHandlerRef = useRef<((e: Event) => void) | null>(null);
    const loadMoreTriggeredRef = useRef(false);

    // Calculate visible range with bidirectional overscan
    // This ensures smooth scrolling in both upward and downward directions
    // by rendering a buffer of rows above and below the visible area
    // Enforce minimum 20 and maximum 60 visible records at a time
    const minVisibleRows = 20;
    const maxVisibleRows = 60;

    // Calculate base visible range based on scroll position
    let startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
    let endIndex = Math.min(
        items.length - 1,
        Math.ceil((scrollTop + containerSize) / rowHeight) + overscan
    );

    // Calculate current visible count
    let visibleCount = endIndex - startIndex + 1;

    // If we have fewer items than minVisibleRows, show all available items
    if (items.length < minVisibleRows && items.length > 0) {
        startIndex = 0;
        endIndex = items.length - 1;
        visibleCount = items.length;
    }
    // Ensure minimum 20 rows are rendered (if we have that many items available)
    else if (visibleCount < minVisibleRows && items.length >= minVisibleRows) {
        // Expand the range to show at least minVisibleRows, centered around current range
        const neededExpansion = minVisibleRows - visibleCount;
        const expandBefore = Math.floor(neededExpansion / 2);
        const expandAfter = neededExpansion - expandBefore;

        startIndex = Math.max(0, startIndex - expandBefore);
        endIndex = Math.min(items.length - 1, endIndex + expandAfter);

        // If we hit bounds, adjust the other side
        if (startIndex === 0 && endIndex < items.length - 1) {
            endIndex = Math.min(items.length - 1, endIndex + (minVisibleRows - (endIndex - startIndex + 1)));
        } else if (endIndex === items.length - 1 && startIndex > 0) {
            startIndex = Math.max(0, startIndex - (minVisibleRows - (endIndex - startIndex + 1)));
        }

        visibleCount = endIndex - startIndex + 1;
    }

    // Ensure we don't exceed maxVisibleRows
    if (visibleCount > maxVisibleRows) {
        // Trim from the calculated range to maxVisibleRows
        const excess = visibleCount - maxVisibleRows;
        const trimStart = Math.floor(excess / 2);
        startIndex = startIndex + trimStart;
        endIndex = endIndex - (excess - trimStart);
        visibleCount = maxVisibleRows;
    }

    // Final bounds check
    startIndex = Math.max(0, Math.min(startIndex, items.length - 1));
    endIndex = Math.max(startIndex, Math.min(endIndex, items.length - 1));

    const visibleItems = items.slice(startIndex, endIndex + 1);

    // Find scroll container and attach scroll listener
    useEffect(() => {
        if (!tbodyRef.current) return;

        // Find the overflow container (could be the outer div or the Table's wrapper)
        const findScrollContainer = (element: HTMLElement | null): HTMLElement | null => {
            if (!element) return null;
            let bestMatch: HTMLElement | null = null;
            let current = element.parentElement;

            // First pass: look for container with both overflow and max-height (best match)
            while (current) {
                const style = window.getComputedStyle(current);
                const hasOverflow = style.overflow === 'auto' ||
                    style.overflowY === 'auto' ||
                    style.overflow === 'scroll' ||
                    style.overflowY === 'scroll';
                const hasMaxHeight = style.maxHeight && style.maxHeight !== 'none';

                if (hasOverflow && hasMaxHeight) {
                    return current; // Best match found
                }

                if (hasOverflow && !bestMatch) {
                    bestMatch = current; // Save as fallback
                }

                current = current.parentElement;
            }

            return bestMatch;
        };

        const scrollContainer = findScrollContainer(tbodyRef.current);
        if (!scrollContainer) {
            console.warn('VirtualizedTableBody: Could not find scroll container');
            return;
        }

        // Get the table header height to account for in calculations
        const table = tbodyRef.current.closest('table');
        const thead = table?.querySelector('thead');
        const headerHeight = thead?.offsetHeight || 48; // Default header height

        // Set initial container size (full height minus header for visible area calculation)
        const updateContainerSize = () => {
            if (!containerHeight) {
                const containerRect = scrollContainer.getBoundingClientRect();
                const newSize = Math.max(100, containerRect.height - headerHeight);
                setContainerSize(newSize);
            }
        };

        // Use requestAnimationFrame to avoid synchronous setState in effect
        requestAnimationFrame(updateContainerSize);

        // Handle scroll - scrollTop is from the start of the scroll container
        // but we want to know the scroll position relative to the tbody
        const handleScroll = () => {
            const scrollTopValue = scrollContainer.scrollTop;
            // If scrolling past header, adjust; otherwise use as-is
            const adjustedScrollTop = Math.max(0, scrollTopValue - headerHeight);
            setScrollTop(adjustedScrollTop);

            // Check if we're near the bottom and should load more
            if (onLoadMore && hasMore && !loadMoreTriggeredRef.current) {
                const scrollHeight = scrollContainer.scrollHeight;
                const clientHeight = scrollContainer.clientHeight;
                const scrollPercentage = (scrollTopValue + clientHeight) / scrollHeight;

                // Trigger load more when 80% scrolled
                if (scrollPercentage > 0.9) {
                    loadMoreTriggeredRef.current = true;
                    onLoadMore();
                    // Reset after a delay to allow for new content to load
                    setTimeout(() => {
                        loadMoreTriggeredRef.current = false;
                    }, 1000);
                }
            }
        };

        // Initial scroll position
        handleScroll();

        scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
        scrollHandlerRef.current = handleScroll;

        // Handle resize
        resizeObserverRef.current = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const height = entry.contentRect.height;
                if (height > 0 && !containerHeight) {
                    // Re-measure header height in case it changed
                    const currentHeaderHeight = thead?.offsetHeight || 48;
                    setContainerSize(height - currentHeaderHeight);
                }
            }
        });

        resizeObserverRef.current.observe(scrollContainer);

        return () => {
            if (scrollHandlerRef.current && scrollContainer) {
                scrollContainer.removeEventListener('scroll', scrollHandlerRef.current);
            }
            if (resizeObserverRef.current) {
                resizeObserverRef.current.disconnect();
            }
        };
    }, [containerHeight, items.length, onLoadMore, hasMore]);

    // Reset load more trigger when items change (new data loaded)
    useEffect(() => {
        loadMoreTriggeredRef.current = false;
    }, [items.length]);

    // Update container size if containerHeight prop changes
    useEffect(() => {
        if (containerHeight) {
            // Use requestAnimationFrame to avoid synchronous setState
            requestAnimationFrame(() => {
                setContainerSize(containerHeight);
            });
        }
    }, [containerHeight]);

    // Calculate spacer heights for non-visible rows
    // Top spacer: rows before the visible range (when scrolling down)
    // Bottom spacer: rows after the visible range (when scrolling up)
    // This maintains proper scroll height and position
    const topSpacerHeight = startIndex * rowHeight;
    const bottomSpacerHeight = (items.length - endIndex - 1) * rowHeight;

    return (
        <TableBody ref={tbodyRef} className={className}>
            {topSpacerHeight > 0 && (
                <tr aria-hidden="true" style={{ height: topSpacerHeight, pointerEvents: 'none' }}>
                    <td colSpan={1000} style={{ padding: 0, border: 'none', height: topSpacerHeight }} />
                </tr>
            )}
            {visibleItems.map((item, index) => {
                const actualIndex = startIndex + index;
                const rowProps = getRowProps ? getRowProps(item, actualIndex) : {};
                return (
                    <tr key={actualIndex} style={{ height: rowHeight }} {...rowProps}>
                        {renderRow(item, actualIndex)}
                    </tr>
                );
            })}
            {bottomSpacerHeight > 0 && (
                <tr aria-hidden="true" style={{ height: bottomSpacerHeight, pointerEvents: 'none' }}>
                    <td colSpan={1000} style={{ padding: 0, border: 'none', height: bottomSpacerHeight }} />
                </tr>
            )}
        </TableBody>
    );
}
