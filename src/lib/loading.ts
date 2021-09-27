import { classes } from "./classes";

export const Loading = ({class: c}: {class?: string} = {}) => /*html*/`<svg class=${classes("loading inline-block", c)} width="20" height="21" xmlns="http://www.w3.org/2000/svg">
	<style>
  @keyframes e0o {
			0% {
				opacity: 0.6;
			}
			to {
				opacity: 0;
			}
		}
	</style><g fill="currentColor"
		><path
			d="M6.366 1.706a1 1 0 10-1.732 1l1.5 2.598a1 1 0 001.732-1l-1.5-2.598z"
			style="animation:e0o 1000ms linear 916ms infinite normal forwards"
			opacity="0"
		/><path
			d="M1.706 6.366l2.598 1.5a1 1 0 101-1.732l-2.598-1.5a1 1 0 10-1 1.732z"
			style="animation:e0o 1000ms linear 833ms infinite normal forwards"
			opacity="0"
		/><path
			d="M5 10a1 1 0 00-1-1H1a1 1 0 000 2h3a1 1 0 001-1z"
			style="animation:e0o 1000ms linear 750ms infinite normal forwards"
			opacity="0"
		/><path
			d="M5.67 12.5a1 1 0 00-1.366-.366l-2.598 1.5a1 1 0 101 1.732l2.598-1.5A1 1 0 005.67 12.5z"
			style="animation:e0o 1000ms linear 666ms infinite normal forwards"
			opacity="0"
		/><path
			d="M7.5 14.33a1 1 0 00-1.366.366l-1.5 2.598a1 1 0 101.732 1l1.5-2.598A1 1 0 007.5 14.33z"
			style="animation:e0o 1000ms linear 583ms infinite normal forwards"
			opacity="0"
		/><path
			d="M10 15a1 1 0 00-1 1v3a1 1 0 102 0v-3a1 1 0 00-1-1z"
			style="animation:e0o 1000ms linear 500ms infinite normal forwards"
			opacity="0"
		/><path
			d="M13.866 14.696a1 1 0 00-1.732 1l1.5 2.598a1 1 0 101.732-1l-1.5-2.598z"
			style="animation:e0o 1000ms linear 416ms infinite normal forwards"
			opacity="0"
		/><path
			d="M18.294 13.634l-2.598-1.5a1 1 0 10-1 1.732l2.598 1.5a1 1 0 101-1.732z"
			style="animation:e0o 1000ms linear 333ms infinite normal forwards"
			opacity="0"
		/><path
			d="M19 9h-3a1 1 0 000 2h3a1 1 0 000-2z"
			style="animation:e0o 1000ms linear 250ms infinite normal forwards"
			opacity="0"
		/><path
			d="M14.33 7.5a1 1 0 001.366.366l2.598-1.5a1 1 0 10-1-1.732l-2.598 1.5A1 1 0 0014.33 7.5z"
			style="animation:e0o 1000ms linear 166ms infinite normal forwards"
			opacity="0"
		/><path
			d="M12.5 5.67a1 1 0 001.366-.366l1.5-2.598a1 1 0 10-1.732-1l-1.5 2.598A1 1 0 0012.5 5.67z"
			style="animation:e0o 1000ms linear 83ms infinite normal forwards"
			opacity="0"
		/><path
			d="M10 0a1 1 0 00-1 1v3a1 1 0 002 0V1a1 1 0 00-1-1z"
			style="animation:e0o 1000ms linear infinite normal forwards"
			opacity="0"
		/></g></svg>`;
