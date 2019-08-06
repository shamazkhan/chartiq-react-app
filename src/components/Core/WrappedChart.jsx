import React from 'react'
import { CIQ } from 'chartiq'
import { ChartIQChart } from 'components'
import TitleOverlay from '../Layout/TitleOverlay'
import ToolbarDrawing from '../Features/ToolbarDrawing'
import LoadingWidget from './LoadingWidget'
import HeadsUpStatic from '../Features/HeadsUpStatic'
import HeadsUpDynamic from '../Features/HeadsUpDynamic'
import MarkerAbstract from '../Features/MarkerAbstract'
import DataAttribution from '../Features/DataAttribution'

import Plugins from './Plugins'

import { ChartContext } from '../../react-chart-context'

/**
 * Wrapped chart component `<WrappedChart/>`.
 * 
 * Renders ChartIQ chart canvas and associated DOM elements. The wrapped chart itself has no user interface. You may 
 * use the provided components to add user controls suitable to your project. See components `<BasicChart>` or 
 * `<AdvancedChart>` in this project for reference.
 *
 * @export
 * @class WrappedChart
 * @extends {React.Component}
 */
export default class WrappedChart extends React.Component {

	constructor (props) {
		super(props)

		this.createEngine = container => {
			var config = {container: container, chart: props.chartConstructor, preferences: props.preferences}
			this.stxx = window.stxx = container.stxx = new CIQ.ChartEngine(config)
			window.CIQ = container.CIQ = CIQ
			window.$$$ = container.$$$ = $$$
			let addOns = props.addOns
			container.startChart(this.stxx, this.feed, {refreshInterval: 1, bufferSize: 200}, addOns)
			this.context.setContext({stx: this.stxx})
			this.configurePlugins(this.stxx)
		}

		this.engineRef = React.createRef()
		if(props.plugins) {
			if(props.plugins.cryptoiq) this.orderbookRef = React.createRef()
		}
		this.feed = this.props.quoteFeed || quoteFeedSimulator
	}

	componentDidMount() {
		this.createEngine(this.engineRef.current);
		window.addEventListener("resize", this.resizeScreen.bind(this));
		this.resizeScreen();
	}

	configurePlugins(stx) {
		const plugins = this.props.plugins;
		if (!plugins) return;
		if (plugins.cryptoiq) {
			const defaultMD = {stx: stx, volume:true, mountain:true, step:true, record: true, height:"50%"}
			new CIQ.MarketDepth(Object.assign(defaultMD, plugins.cryptoiq.MarketDepth))
			let quoteFeed = stx.quoteDriver.quoteFeed
			if(quoteFeed && quoteFeed.url && quoteFeed.url.includes("simulator.chartiq.com")) CIQ.simulateL2({stx:stx, onTrade:true});
		}
		if (plugins.TFC) {
			new CIQ.TFC({stx:stx, account: plugins.TFC.account, context:this.context.UIContext})
		}
	}

	resizeScreen(){
		let containerWidth = document.querySelector('.cq-chart-container').offsetWidth;

		document.body.classList.remove('break-lg','break-md','break-sm')
		if (containerWidth> 700) {
			document.body.classList.add('break-lg');
		}
		else if (containerWidth <= 700 && containerWidth > 584) {
			document.body.classList.add('break-md');
		}
		else if (containerWidth <= 584) {
			document.body.classList.add('break-sm');
		}
	}

	render () {
		const props = this.props;
		const context = this.context;
		const plugins = props.plugins || {}

		const Comparison = React.forwardRef((props, ref) => (
			ref.current && <ChartComparison forwardeRef={ref} />
		))

		const classes = props.classes || "ciq-chart-area"
		return (
			<React.Fragment>
				<div className={"ciq-chart"}>
					{context.stx &&
						<>
						<ToolbarDrawing />
						<MarkerAbstract />
						</>
					}
					<chartiq-chart class="chartContainer" defer-start="true" animations="false" ref={this.engineRef}>
						{ context.stx && <TitleOverlay refProp={this.engineRef} /> }
						<LoadingWidget />
						{props.dynamicHeadsUp && context.stx && <HeadsUpDynamic />
						}

						{props.staticHeadsUp && context.stx && <HeadsUpStatic />
						}
						<DataAttribution />
						{this.props.children}
					</chartiq-chart>

				</div>
			</React.Fragment>
		)
	}
}

WrappedChart.contextType = ChartContext;
