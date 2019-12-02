import React from 'react';

import { CIQ, MarkersSample } from 'chartiq/examples/markers/markersSample';
import { ChartContext } from '../../ChartContext';

/**
 * Chart menu component `<MenuEvents>`
 *
 * IMPORTANT: To ensure proper stying, ALL menu components must be nested within a {@link ChartNav} container.
 *
 * Dropdown menu of event marker display settings
 *
 * @export
 * @class MenuEvents
 * @extends {React.Component}
 */
export default class MenuEvents extends React.Component {
	constructor() {
		super();
		this.state = {
			activeEvent: 'none'
		}
		this.markerImplementation = {};
	}

	componentDidMount() {
		const { UIContext, stx } = this.context;
		this.markerImplementation = new MarkersSample(stx);

		// set up helper for forwarding marker handling events
		const self = this;
		const Markers = {
			show(node, item) { 
				self.setState({ activeEvent: item });
				self.markerImplementation.showMarkers(item.replace('none', ''));
			}
		};

		UIContext.advertiseAs(Markers, 'Markers');
		this.loadAdditionalHandlers();
	}

	loadAdditionalHandlers() {
		const { menu_events } = this.context.config;

		// load trade event markers only when requested in menu configuration
		if (!menu_events.find(({ markertype }) => markertype === 'trade')) {
			return;
		}
		const self = this;

		Promise.all([
			import('chartiq/examples/markers/tradeAnalyticsSample'),
			import('chartiq/examples/markers/tradeAnalyticsSample.css')
		]).then(items => {
			const [{ MarkersSample }] = items; 
			const { stx } = self.context;
			self.setState({ tradeAnalyticsEventAvailable: true  });
			this.markerImplementation = new MarkersSample(stx);
		})
		.catch(err => console.error(err));
	}

	render() {
		const { activeEvent } = this.state;
		const { menu_events } = this.context.config;
		const menuItems = menu_events.map((item, index) => {
			// as menu item is using stxtap all items need to be created at once
			// or binding will not apply
			// hide not applicable nodes
			const style = {
				display: item.require && !this.markerImplementation[item.require] ? 'none' : ''
			};
			
			return <MenuItem {...item} selected={activeEvent === item.markertype} key={index} style={style} />
		});

		return (
			<cq-menu class="ciq-menu stx-markers collapse">
				<span>Events</span>
				<cq-menu-dropdown ref={this.markerDropdown}>
					{ menuItems }
				</cq-menu-dropdown>
			</cq-menu>
		);
	}
}

function MenuItem({label, markertype, selected, style}) {
	return !label
		? <cq-separator></cq-separator>
		: (<cq-item stxtap={`Markers.show('${markertype}')`} key={label} style={style}>
				{label}
				<span className={`ciq-radio ${ selected ? 'ciq-active' : ''}`}>
					<span></span>
				</span>
			</cq-item>);
}

MenuEvents.contextType = ChartContext;
