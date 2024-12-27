<script>
	import { makeDraggableWithClone, makeDraggable } from 'vvvyyynet_utils_interact';

	function handle_dragWithoutClone(node, inertia) {
		makeDraggable(node, {
			onstart_extra: (ev) => {
				console.log('START');
			},
			onmove_extra: (ev) => {
				console.log('MOVE');
			},
			onend_extra: (ev) => {
				console.log('END');
			},
			inertia: inertia,
			allowFrom: '.unlocked', // tested with :not(.locked), but it does not work
			cloneAddClasses: 'bg-sky-200 border-4 border-black',
			cloneRemoveClasses: 'bg-white rounded-full'
		});
	}

	function handle_dragWithClone(node, remove) {
		makeDraggableWithClone(node, {
			onstart_extra: (ev) => {
				console.log('START');
			},
			onmove_extra: (ev) => {
				console.log('MOVE');
			},
			onend_extra: (ev) => {
				console.log('END');
			},
			removeClonesOnEnd: remove,
			parentNodeOfClone: '#child2',
			allowFrom: '.unlocked', // tested with :not(.locked), but it does not work
			cloneAddClasses: 'bg-red-200 border-4 border-black',
			cloneRemoveClasses: 'bg-white rounded-full'
		});
	}
</script>

<div class="prose">
	<div id="parent" class="absolute grid h-screen w-full grid-cols-2 overflow-hidden">
		<div id="child1" class="h-full overflow-y-scroll bg-red-200 p-10">
			<div class="m-5">
				<h1 class="font-bold">Dragging without Clone</h1>
				<p class="">
					Note, that you cannot drag to the right area. The reason is, that the parent-div of the
					draggables is scrollable.
				</p>
			</div>
			<div class="unlocked m-3 rounded-full bg-white p-3" use:handle_dragWithoutClone={true}>
				I have inertia
			</div>
			<div class="unlocked m-3 rounded-full bg-white p-3" use:handle_dragWithoutClone={true}>
				I have inertia
			</div>
			<div class=" m-3 rounded-full bg-white p-3" use:handle_dragWithoutClone={false}>
				I am not unlocked!
			</div>
			<div class=" m-3 rounded-full bg-white p-3" use:handle_dragWithoutClone={false}>
				I am not unlocked!
			</div>
			<div class="unlocked m-3 rounded-full bg-white p-3" use:handle_dragWithoutClone={false}>
				Drag me!
			</div>
			<div class="unlocked m-3 rounded-full bg-white p-3" use:handle_dragWithoutClone={false}>
				Drag me!
			</div>
			<div class="h-[9999px]"></div>
		</div>

		<div id="child2" class="h-full overflow-y-scroll bg-sky-200 p-10">
			<div class="m-5">
				<h1 class="font-bold">Dragging with Clone</h1>
				<p class="">Here it works</p>
			</div>

			<div class="unlocked m-3 rounded-full bg-white p-3" use:handle_dragWithClone={false}>
				I will copy around!
			</div>
			<div class="unlocked m-3 rounded-full bg-white p-3" use:handle_dragWithClone={false}>
				I will copy around!
			</div>
			<div class=" m-3 rounded-full bg-white p-3" use:handle_dragWithClone={true}>
				I am not unlocked!
			</div>
			<div class=" m-3 rounded-full bg-white p-3" use:handle_dragWithClone={true}>
				I am not unlocked!
			</div>
			<div class="unlocked m-3 rounded-full bg-white p-3" use:handle_dragWithClone={true}>
				Drag me!
			</div>
			<div class="unlocked m-3 rounded-full bg-white p-3" use:handle_dragWithClone={true}>
				Drag me!
			</div>
			<div class="h-[9999px]"></div>
		</div>
	</div>
</div>
