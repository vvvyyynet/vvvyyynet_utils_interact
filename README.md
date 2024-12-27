# vvvyyynet_utils_interact

A collection of utility functions for various tasks.

## Installation

```bash
npm install vvvyyynet_utils_interact
```

## Usage

```bash
import { makeDraggableWithClone } from 'vvvyyynet_utils_interact';
```

## Features
- a wrapper for simple dragging
- a wrapper for clone-dragging

*Shared features*
- allow adding/removing/toggling classes (can be separated by white-space, so it's tailwind-ready)
- will prevent userSelect on body during drag (no setting yet)

*Features for clone-dragging*
  - allowFrom = '*',
	-	inertia = false,
	-	autoScroll = false,
	-	parentNodeOfClone = 'body',
	-	removeClonesOnEnd = true,
	-	hideOriginalOnDrag = true,
	-	cloneAddClasses = null,
	-	cloneRemoveClasses = null,
	-	cloneToggleClasses = null

## Todo
- What to do with the vvvyyynet_isClone-Attribute on drag-end? (see comment in code)
- Allow clone-styling to be coppied to original after drag (maybe rethink and rename the variables)
  - if (removeClonesOnEnd=true) this should apply to the clones instead
- If (removeClonesOnEnd=true) allow clones to be dragged again
  - may be hard, since I did this with svelte's use:handle_drag, which won't work in JS... maybe via the "vvvyyynet_isClone-Attribute" (rename it to wasClone) or set 1,2,3 instad of true/false.
- maybe rename the removeClonesOnEnd feature to something with copy