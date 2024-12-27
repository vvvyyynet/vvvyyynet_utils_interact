<script>
	import { SvelteSet } from 'svelte/reactivity';
	import { makeDraggableWithClone } from 'vvvyyynet_utils_interact';

	function dragme(node) {
		// node = document.querySelector('#draggableElement');

		makeDraggableWithClone(node, {
			onStart: (ev) => {
				console.log('START');
			},
			onMove: (ev) => {
				console.log('MOVE');
			},
			onEnd: (ev) => {
				console.log('END');
			},
			allowFrom: '.selected > div'
		});
	}

	const elements = [
		{ id: 0, text: 'First Text' },
		{ id: 1, text: 'Second Text' },
		{ id: 2, text: 'Some Text' },
		{ id: 3, text: 'Some Text' },
		{ id: 4, text: 'Some Text' },
		{ id: 5, text: 'Some Text' },
		{ id: 6, text: 'Some Text' },
		{ id: 7, text: 'Some Text' },
		{ id: 8, text: 'Some Text' },
		{ id: 9, text: 'Some Text' },
		{ id: 10, text: 'Some Text' },
		{ id: 11, text: 'Some Text' }
	];

	let allowedList = $state(new SvelteSet([...Array(elements.length).keys()]));

	let elFiltered = $derived(
		elements.filter((el) => {
			console.log(el.id);
			return allowedList.has(el.id);
		})
	);
	$inspect(allowedList);
	$inspect(elFiltered);
</script>

<div class="prose mx-auto max-w-[80%] p-5">
	<h3>Problem</h3>
	<p>
		Highlight (1) in both lists and then remove (1) from the lists. This is why each-block for
		filtered lists <strong>must be keyed. </strong>
	</p>

	<!-- Buttons -->
	<h3>Toggle list elements</h3>

	{#each [...Array(elements.length).keys()] as value}
		<button
			onclick={() => {
				if (allowedList.has(value)) allowedList.delete(value);
				else allowedList.add(value);
			}}>{value + 1}</button
		>
	{/each}

	<!-- Lists -->
	{#snippet list(element)}
		<div class="w-full bg-white p-3" use:dragme>
			<p>
				<span>{element.id + 1}</span>
				<span>{element.text}</span>
			</p>
			<button
				onclick={(ev) => {
					ev.target.parentNode.classList.toggle('selected');
				}}>Highlight</button
			>
			<div class="draggable bg-blue-200 p-3">Drag me</div>
		</div>
	{/snippet}
	<div class="grid grid-cols-2 gap-5">
		<div class="flex flex-col gap-4">
			<h4>List *Without* Each-Key</h4>
			{#each elFiltered as element}
				{@render list(element)}
			{/each}
		</div>

		<div class="flex flex-col gap-4">
			<h4>List *With* Each-Key</h4>
			{#each elFiltered as element (element.id)}
				{@render list(element)}
			{/each}
		</div>
	</div>
</div>

<style>
	:global(.selected) {
		background-color: #fe7d7d !important;
	}
	button {
		background-color: #7fb0ff;
		padding: 10px;
	}
</style>
