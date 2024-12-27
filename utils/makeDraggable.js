import interact from 'interactjs';
import {dragElement} from './dragElement'
import {handleClassListActions} from './handleClassListActions'


let DRAG = {
	is_dragging: false,
};

// Main draggable function with clone creation and movement handling
export function makeDraggable(
	node,
	{
		allowFrom = '*',
		inertia = false,
		autoScroll = false,
		onstart_extra = (ev) => {},
		onmove_extra = (ev) => {},
		onend_extra = (ev) => {},
		cloneAddClasses = null,
		cloneRemoveClasses = null,
		cloneToggleClasses = null
	}
) {
	// --------------------
	// DEFAULTS
	// --------------------
	// allowFrom = "*" (Allow dragging from anywhere within the node)
	// inertia = false
	// autoScroll = false (Note: autoScroll *does* work, but the clone will get offset. //! TODO manual adjustments needed)
	// onstart_extra
	// onmove_extra
	// onend_extra
	// cloneAddClasses = null (add (tailwind)classes to the clone)
	// cloneRemoveClasses = null (remove (tailwind)classes to the clone)
	// cloneToggleClasses = null (toggle (tailwind)classes to the clone)

	// Make draggable
	interact(node)
		.draggable({
			allowFrom: allowFrom,
			inertia: inertia,
			autoScroll: autoScroll,

			// On drag start
			onstart: (ev) => {
				// Custom Action
				onstart_extra(ev);
				// Disable text selection directly by modifying the style
				document.body.style.userSelect = 'none';
				document.body.style.webkitUserSelect = 'none'; // For Safari
				document.body.style.MozUserSelect = 'none'; // For Firefox
				document.body.style.msUserSelect = 'none'; // For IE/Edge

				// Add/remove/toggle cloneClasses
				handleClassListActions(node, 'add', cloneAddClasses)
				handleClassListActions(node, 'remove', cloneRemoveClasses)
				handleClassListActions(node, 'toggle', cloneToggleClasses)
				
				// Reset active-flag
				DRAG.is_dragging = true;
			},

			// On drag move: Apply transformation to move the element
			onmove: (ev) => {
				dragElement(ev);
				onmove_extra(ev); // Custom Action
			},

			// On drag end: Restore the original element and remove the clone
			onend: (ev) => {
				// Custom Action
				onend_extra(ev);

				// Add/remove/toggle cloneClasses
				handleClassListActions(node, 'remove', cloneAddClasses);
				handleClassListActions(node, 'add', cloneRemoveClasses);
				handleClassListActions(node, 'toggle', cloneToggleClasses);
				
				// Re-enable text selection after drag ends
				document.body.style.userSelect = ''; // Reset to default
				document.body.style.webkitUserSelect = ''; // Reset Safari
				document.body.style.MozUserSelect = ''; // Reset Firefox
				document.body.style.msUserSelect = ''; // Reset IE/Edge

				// Reset active-flag
				DRAG.is_dragging = false;
			}
		});
}
