
export function handleClassListActions(element, action, classes) {
  // Split the 'classes' string by whitespace, then trim and filter out any empty values.
	if (!classes) return
  classes.split(/\s+/).forEach(className => {

    if (className.trim()) {
			switch (action) {
				case 'add':
					element.classList.add(className.trim());
					break;
				case 'remove':
					element.classList.remove(className.trim());
					break;
				case 'toggle':
					element.classList.toggle(className.trim());
					break;
			}
		}
	});
}