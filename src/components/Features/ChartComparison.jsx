import React from 'react'
import { Comparisons } from 'components'
import { ChartContext } from '../../react-chart-context'

export default class ChartComparison extends React.Component {

	componentDidMount () {
		// let context = this.context.UIContext
		// let engine = this.context.stx
		// let comparison = $$$('cq-comparison')
		// let lookupTemplate = $$$('[cq-lookup]', comparison)
		console.log('React comparison component mounted')
		// var lookup = CIQ.UI.makeFromTemplate(lookupTemplate);
		// lookupTemplate.firstElementChild.remove()
		// $$$('cq-comparison-lookup-frame',comparison).appendChild(lookup[0])
	}

	render () {
		let context = this.context.UIContext

		return (
			<cq-comparison marker="true" style={{zIndex: 23, display: 'inline-block'}}>
				<cq-menu className="cq-comparison-new">
					<cq-comparison-add-label>
						<cq-comparison-plus></cq-comparison-plus><span>Compare</span><span>...</span>
					</cq-comparison-add-label>
					<cq-comparison-add>
						<cq-comparison-lookup-frame>
							{/*<template cq-lookup="true">*/}
								<cq-lookup cq-keystroke-claim>
									<cq-lookup-input cq-no-close>
										<input type="text" cq-focus="here" spellCheck="off" autoComplete="off" autoCorrect="off" autoCapitalize="off" placeholder="Enter Symbol" />
										<cq-lookup-icon></cq-lookup-icon>
									</cq-lookup-input>
										<cq-lookup-results>
											<cq-scroll></cq-scroll>
										</cq-lookup-results>
								</cq-lookup>
							{/*</template>*/}
						</cq-comparison-lookup-frame>
						<cq-swatch cq-no-close></cq-swatch>
						<span><cq-accept-btn class="stx-btn">ADD</cq-accept-btn></span>
					</cq-comparison-add>
				</cq-menu>
				<cq-comparison-key>
					<template cq-comparison-item="true">
						<cq-comparison-item>
							<cq-comparison-swatch></cq-comparison-swatch>
							<cq-comparison-label>AAPL</cq-comparison-label>
							<cq-comparison-price cq-animate></cq-comparison-price>
							<cq-comparison-loader></cq-comparison-loader>
							<div className="stx-btn-ico ciq-close"></div>
						</cq-comparison-item>
					</template>
				</cq-comparison-key>
		</cq-comparison>
		)
	}
}

ChartComparison.contextType = ChartContext;