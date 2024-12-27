# vvvyyynet_utils_interact

A collection of utility functions for various tasks.

## Installation

```bash
npm install vvvyyynet_utils_interact
```
Or simply link it offline

```bash
npm link # in this repo
npm link vvvyyynet_utils_interact # in consumer repo
```

## Usage

```bash
import { makeDraggableWithClone } from 'vvvyyynet_utils_interact';
```

## Features
- a wrapper for simple dragging
- a wrapper for clone-dragging

### Shared features
- allow adding/removing/toggling classes (can be separated by white-space, so it's tailwind-ready)
- will prevent userSelect on body during drag (no setting yet)

### Features for clone-dragging
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
### General/NPM
- feat: add automatic semanticVersioning

### Performance and Optimisation
- Find out, if it makes a difference, to either
  1. add the makeDraggable-Listeners with use: to each element (well, the function is only read once, but still...)
	2. add the makeDraggable-Listeners elsewhere and instead of using `node` use `document.querySelector('draggable')`. (Does this event delegation even work?)

### Fixes
- fix: What to do with the vvvyyynet_isClone-Attribute on drag-end? (see comment in code)
- fix: autoScroll does not work yet, only on body...


### Features
- feat: Allow clone-styling to be coppied to original after drag (maybe rethink and rename the variables)
  - if (removeClonesOnEnd=true) this should apply to the clones instead
- feat: If (removeClonesOnEnd=true) allow clones to be dragged again
  - may be hard, since I did this with svelte's use:handle_drag, which won't work in JS... maybe via the "vvvyyynet_isClone-Attribute" (rename it to wasClone) or set 1,2,3 instad of true/false.
- feat: Add mode appendToNewParentAfterDrag and prependToNewParentAfterDrag
	- currently, since the clone keeps its position-absolute-style onend, if you scroll the parent, the clone will stay, even though it is a child. 
	- Just removing the style will append it per default -> give some more options (prepend, append, maybe even sort... but there are other libraries for this.)
- feat: Add mode where clone inherits also the calulated dimensions of its original (i.e. w-full etc.)
- feat: Make userSelect-feature optional

### Chore and Refactor
- chore: Consider renaming the removeClonesOnEnd feature to something with copy
- refactor: move userSelect-feature to own function, since it is shared by both wrappers

