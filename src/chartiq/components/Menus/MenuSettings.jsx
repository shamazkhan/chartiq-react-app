import React from 'react';
import { ChartContext } from '../../ChartContext';

/**
 * Chart menu component `<MenuSettings>`
 * 
 * IMPORTANT: To ensure proper stying, ALL menu components must be nested within a {@link ChartNav} container.
 * 
 * Dropdown menu of chart customization settings
 *
 * @export
 * @class MenuSettings
 * @extends {React.Component}
 */
export default class MenuSettings extends React.Component {
	constructor (){
		super()
		this.themesRef = React.createRef()
	}
	
	componentDidMount () {
		const themes = this.themesRef.current;
		if (!themes) {
			setTimeout(() => this.initThemes(), 10);
			return;
		}
		const themeParams = {
			builtInThemes: { "ciq-day":"Day", "ciq-night":"Night" },
			defaultTheme: "ciq-night",
			// nameValueStore: UIStorage
		}
		themes.initialize(themeParams)
	}

	initThemes () {
	;
	}

	getMenuItems() {
		const self = this;
		const { menu_display, plugins = {}} = self.context.config || {};
		if (!menu_display) {
			return null;
		}

		if (this.menuItems) {
			return this.menuItems;
		}

		this.menuItems = menu_display.map(itemToMarkup);
		return this.menuItems;
			
		function itemToMarkup({ label, action, option, type, required }, index) {
			if (type === 'heading') {
				return (<cq-heading key={label}>Chart Style</cq-heading>);
			}
			if (type === 'separator') {
				return (<cq-separator key={index}></cq-separator>);
			}
			if (type === 'checkbox') {
				if (required && !plugins[required]) {
					if (CIQ.debug) {
						console.log(`Menu ${label} disabled due to ${required} plugin not enabled`);
					}
					return null;
				}
				return (
					<cq-item stxsetget={action} key={label}>{label}<span className="ciq-checkbox ciq-active"><span></span></span></cq-item>
				);
			}
			if (type === 'radio') {
				return (
					<cq-item key={label}>
						{option && <span className="ciq-edit" stxtap={option}></span>}
						<div stxsetget={action}>{label}<span className="ciq-radio"><span></span></span></div>
					</cq-item>
				);
			}
			if (type === 'timezone') {
				return (
					<cq-item key={type}><cq-clickable cq-selector="cq-timezone-dialog" cq-method="open">Change Timezone</cq-clickable></cq-item>
				);
			}
			if (type === 'languages') {
				return (
					<cq-item stxsetget="Layout.Language()" key={type}><cq-flag></cq-flag><cq-language-name>Change Language</cq-language-name></cq-item>
				);
			}
			if (type === 'themes') {
				return (
					<cq-themes ref={self.themesRef} key={type}>
						<cq-themes-builtin cq-no-close>
							<template>
								<cq-item></cq-item>
							</template>
						</cq-themes-builtin>
						<cq-themes-custom cq-no-close>
							<template>
								<cq-theme-custom>
									<cq-item>
										<cq-label></cq-label>
										<cq-close></cq-close>
									</cq-item>
								</cq-theme-custom>
							</template>
						</cq-themes-custom>
						<cq-separator cq-partial></cq-separator>
						<cq-item stxtap="newTheme()"><cq-plus></cq-plus>{label}</cq-item>
					</cq-themes>
				);
			}
		}
	}

	render () {
		return (
			<cq-menu class="ciq-menu ciq-display collapse">
				<span>Display</span>
				<cq-menu-dropdown>
					{this.getMenuItems()}
				</cq-menu-dropdown>
			</cq-menu>
		)
	}
}

MenuSettings.contextType = ChartContext;
