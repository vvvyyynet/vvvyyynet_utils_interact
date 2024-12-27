import interact from 'interactjs';
import {dragElement} from './dragElement'
import {handleClassListActions} from './handleClassListActions'

let DRAG = {
	is_dragging: false,
	node_orig: undefined,
	node_clone: undefined
};


// Main draggable function with clone creation and movement handling
export function makeDraggableWithClone(
	node,
	{
		onstart_extra = (ev) => {},
		onmove_extra = (ev) => {},
		onend_extra = (ev) => {},
		allowFrom = '*',
		inertia = false,
		autoScroll = false,
		parentNodeOfClone = 'body',
		removeClonesOnEnd = true,
		hideOriginalOnDrag = true,
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
	// parentNodeOfClone = 'body' (any queryString or node allowed) Note, that with 'body' it may lead to awkward scrolling behavior together with autoScroll
	// removeClonesOnEnd = true
	// cloneAddClasses = null (add (tailwind)classes to the clone)
	// cloneRemoveClasses = null (remove (tailwind)classes to the clone)
	// cloneToggleClasses = null (toggle (tailwind)classes to the clone)

	if((typeof cloneAddClasses !== 'string') || (cloneAddClasses.length == 0)) {
		cloneAddClasses = null;
	}
	if((typeof cloneRemoveClasses !== 'string') || (cloneRemoveClasses.length == 0)) {
		cloneRemoveClasses = null;
	}
	if((typeof cloneToggleClasses !== 'string') || (cloneAddClasses.length == 0)) {
		cloneToggleClasses = null;
	}

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
			},

			// On drag move: Apply transformation to move the element
			onmove: (ev) => {
				// Prevent original element from being dragged while clone is made
				if (ev.target.getAttribute('vvvyyynet_isClone')) {
					dragElement(ev);
				}

				// Custom Action
				onmove_extra(ev);
			},

			// On drag end: Restore the original element and remove the clone
			onend: (ev) => {
				// Custom Action
				onend_extra(ev);

				// Re-enable text selection after drag ends
				document.body.style.userSelect = ''; // Reset to default
				document.body.style.webkitUserSelect = ''; // Reset Safari
				document.body.style.MozUserSelect = ''; // Reset Firefox
				document.body.style.msUserSelect = ''; // Reset IE/Edge

				// Show original again
				if (hideOriginalOnDrag && DRAG.node_orig) {
					DRAG.node_orig.style.opacity = 1;
					DRAG.node_orig = undefined;
				}

				// Add/remove/toggle cloneClasses
				handleClassListActions(DRAG.node_clone, 'remove', cloneAddClasses);
				handleClassListActions(DRAG.node_clone, 'add', cloneRemoveClasses);
				handleClassListActions(DRAG.node_clone, 'toggle', cloneToggleClasses);

				// Remove clone
				if (removeClonesOnEnd && DRAG.node_clone) {
					DRAG.node_clone.remove();
					DRAG.node_clone = undefined;
				} else {
					//! DEBUG: if set false, then the clone will stick to the cursor. 
					// clone.setAttribute('vvvyyynet_isClone',false);
					// clone.setAttribute('vvvyyynet_wasClone',true); // could be a workaroud
				}

				// Reset active-flag
				DRAG.is_dragging = false;
			}
		})
		.on('move', (ev) => {
			const el = ev.target; //! DEBUG: check if in special cases ev.currentTarget needed

			// Only proceed if an active drag is ongoing
			if (
				ev.interaction.pointerIsDown && // Pointer must be down
				ev.interaction.interacting() // Prevent activation by panning through element (interaction must start on element)
			) {

				// console.log('HERE BAD THINGS HAPPEN, WHEN DRAGGING OVER ANOTHER DRAGGABLE', DRAG.is_dragging);

				// If element is NOT the clone -> create one
				if (
					!DRAG.is_dragging && // Makes sure, that only one single clone is created
					!el.getAttribute('vvvyyynet_isClone') // Prevent re-cloning clones (just for safety, maybe not needed)
				) {
					// Makes sure, that only one single clone is created
					DRAG.is_dragging = true;

					// Clone node
					let clone = el.cloneNode(true);
					clone.setAttribute('vvvyyynet_isClone', true);

					// Set position of clone (//! DEBUG gets offset if dragged too fast)
					clone.style.position = 'absolute';
					clone.style.left = `${el.offsetLeft}px`;
					clone.style.top = `${el.offsetTop}px`;

					// Add/remove/toggle cloneClasses
					handleClassListActions(clone, 'add', cloneAddClasses)
					handleClassListActions(clone, 'remove', cloneRemoveClasses)
					handleClassListActions(clone, 'toggle', cloneToggleClasses)

					// Append Clone and start drag interaction
					document.querySelector(parentNodeOfClone).appendChild(clone);

					// Store references to the original and clone nodes
					DRAG.node_orig = el;
					DRAG.node_clone = clone;
					// hide original while dragging clone
					if (hideOriginalOnDrag) {
						DRAG.node_orig.style.opacity = 0;
					}

					// Stop drag-interaction on original node and apply it on the clone instead
					ev.interaction.stop();
					ev.interaction.start({ name: 'drag' }, ev.interactable, clone);

					// If element is the clone -> drag it
					// -> For cases, where removeClonesOnEnd==false
					// -> //! TEST THIS
				} else if (el.getAttribute('vvvyyynet_isClone')) {
					dragElement(ev);
				}
			}
		});
}
