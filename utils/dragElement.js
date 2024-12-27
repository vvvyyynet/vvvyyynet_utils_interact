// Function to handle the drag movement
export function dragElement(ev) {
	const el = ev.target;
	let x = (parseFloat(el.getAttribute('data-x')) || 0) + ev.dx;
	let y = (parseFloat(el.getAttribute('data-y')) || 0) + ev.dy;
	el.style.webkitTransform = el.style.transform = `translate(${x}px,${y}px)`;
	el.setAttribute('data-x', x);
	el.setAttribute('data-y', y);
}