/**
 * Shared TypeScript interfaces for the SideDrawer component family.
 * Imported by SideDrawer.astro and all section sub-components.
 */

export interface DrawerAction {
	id: string;
	label?: string | undefined;
	icon?: string | undefined;
	onClick?: string | undefined;
	href?: string | undefined;
	variant?: "primary" | "secondary" | "ghost" | undefined;
}

export interface DrawerSectionItem {
	id: string;
	type?: "text" | "stats" | "media" | "actions" | "list" | "custom" | undefined;
	title?: string | undefined;
	subtitle?: string | undefined;
	description?: string | undefined;
	image?: string | undefined;
	value?: string | number | undefined;
	meta?: string[] | undefined;
	rating?: number | undefined;
	content?: string | undefined;
	actions?: DrawerAction[] | undefined;
	items?: DrawerSectionItem[] | undefined;
}

export interface DrawerSection {
	id: string;
	title?: string | undefined;
	items: DrawerSectionItem[];
}
