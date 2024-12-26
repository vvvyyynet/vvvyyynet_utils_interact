 
import interact from 'interactjs';

// Function to handle the drag movement
function dragElement(ev) {
	const el = ev.target;
	let x = (parseFloat(el.getAttribute('data-x')) || 0) + ev.dx;
	let y = (parseFloat(el.getAttribute('data-y')) || 0) + ev.dy;
	el.style.webkitTransform = el.style.transform = `translate(${x}px,${y}px)`;
	el.setAttribute('data-x', x);
	el.setAttribute('data-y', y);
}

// Main draggable function with clone creation and movement handling
export function makeDraggableWithClone(
	node,
	{onStart = (ev) => {},
	onMove= (ev) => {},
	onEnd= (ev) => {}
  },
	allowFrom = '*',
	inertia = false,
	autoScroll = false,
	parentNodeOfClone = 'body',
  removeClonesOnEnd = true,
  removeOriginalOnDrag = true,
) {
  // --------------------
	// DEFAULTS
  // --------------------
	// allowFrom = "*" (Allow dragging from anywhere within the node)
	// inertia = false
	// autoScroll = false (Note: autoScroll *does* work, but the clone will get offset. //! TODO manual adjustments needed)
	// onStart
	// onMove
	// onEnd
  // parentNodeOfClone = 'body' (can also be a node)
  // removeClonesOnEnd = true
  // removeOriginalOnDrag = true

	let DRAG = {
		is_active: false,
		node_orig: undefined,
		node_clone: undefined
	};

	interact(node)
		.draggable({
			allowFrom: allowFrom,
			inertia: inertia,
			autoScroll: autoScroll,

			// On drag start
			onstart: (ev) => {
        // Custom Action
				onStart(ev);
			},

			// On drag move: Apply transformation to move the element
			onmove: (ev) => {
				dragElement(ev);

        // Custom Action
				onMove(ev);
			},

      // On drag end: Restore the original element and remove the clone
      onend: (ev) => {

        // Custom Action
        onEnd(ev);

        // Show original again
				if (removeOriginalOnDrag && DRAG.node_orig) {
					DRAG.node_orig.style.opacity = 1;
          DRAG.node_orig = undefined;
				}

				// Remove clone
				if (removeClonesOnEnd && DRAG.node_clone) {
					DRAG.node_clone.remove();
					DRAG.node_clone = undefined;
				}

        // Reset active-flag
				DRAG.is_active = false;
			}
		})
		.on('move', (ev) => {
			const el = ev.target; //! DEBUG: check if in special cases ev.currentTarget needed
			const interaction = ev.interaction;

      // Only proceed if an active drag is ongoing
			if (
				interaction.pointerIsDown && // Pointer must be down
				interaction.interacting() // Prevent activation by panning through element (interaction must start on element)
			) {
        // If element is NOT the clone -> create one
				if (
					!DRAG.is_active && // Makes sure, that only one single clone is created
					!el.classList.contains('isClone') // Prevent re-cloning clones (just for safety, maybe not needed)
				) {
					// Makes sure, that only one single clone is created
					DRAG.is_active = true;

					// Clone node
					let clone = el.cloneNode(true);
					clone.classList.add('isClone');

					// Set position of clone (//! DEBUG gets offset if dragged too fast)
					clone.style.position = 'absolute';
          clone.style.left = `${el.offsetLeft}px`;
          clone.style.top = `${el.offsetTop}px`;

					// Append Clone and start drag interaction
					document.querySelector(parentNodeOfClone).appendChild(clone);

          // Store references to the original and clone nodes
          DRAG.node_orig = el;
					DRAG.node_clone = clone;

          // hide original while dragging clone
          if (removeOriginalOnDrag){
					  DRAG.node_orig.style.opacity = 0;
          }

					// Stop drag-interaction on original node and apply it on the clone instead
					interaction.stop();
					interaction.start({ name: 'drag' }, ev.interactable, clone);

        // If element is the clone -> drag it
        // -> For cases, where removeClonesOnEnd==false
        // -> //! TEST THIS
				} else if (el.classList.contains('isClone')) {
					dragElement(ev);
				}
			}
		});
}
