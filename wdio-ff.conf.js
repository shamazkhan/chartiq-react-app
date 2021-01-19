let debug = process.env.DEBUG;
const {configBase} = require('./stx/spec/e2e-new/wdio.conf');
const AllureReporter = require('@wdio/allure-reporter').default;

let child_process = require('child_process');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');

const devServer = require('webpack-dev-server/lib/Server');

const browsers = [
	{
		maxInstances: debug ? 1 : 3,
		browserName: 'firefox',
		'moz:firefoxOptions': {
			args: debug ? [] : ['-headless'],
			prefs: {
				directory_upgrade: true,
				prompt_for_download: false,
				'download.default_directory': global.downloadDir,
			},
		},
	},
];

// const DEFAULT_BROWSERS = [CHROME_HEADLESS];
// let browsers = DEFAULT_BROWSERS;

const wdioConfig = {
	...configBase,
	...{
		capabilities: browsers,
		services: ['geckodriver'],
		specs: ['./stx/spec/e2e-new/test/specs/e2e/studies-advanced.spec.js'],
		// Because we have different names for our templates across projects, we are accessing them thru configured variables.
		// The template object is a way to set the name of the component's file for this specific repo.
		// NOTE: this is something custom to our configs not a default option of WDIO
		baseUrl: 'http://localhost:4040',
		templates: {
			'advancedChart': 'technical-analysis'
		},
		/**
		 * Gets executed once before all workers get launched.
		 * @param {Object} config wdio configuration object
		 * @param {Array.<Object>} capabilities list of capabilities details
		 */
		onPrepare: function (config, capabilities) {
			child_process.execSync('mkdir -p ./test-output/screenshots');

			const server = new devServer(webpack(webpackConfig()), {logLevel: 'info', historyApiFallback: true});

			server.listen(4040, 'localhost', () => {
				console.log('Starting server on http://localhost:4040');
			});
		},
		/**
		 * Hook that gets executed before the suite starts
		 * @param {Object} suite suite details
		 */
		beforeSuite: function (suite) {
			beforeEach(function () {
				console.log(this.currentTest.parent.title + ' | ' + this.currentTest.title);
			});
		},

		afterTest: async function (test, context, {error, result, duration, passed, retries}) {
			if (error !== undefined) {
				await browser.takeScreenshot();
				const html = browser.getPageSource();
				AllureReporter.addAttachment('browser-console.html', html, 'text/html');

				if (error.hasOwnProperty('response') && error.hasOwnProperty('isAxiosError') && error.isAxiosError) {
					const errorResponse = {
						status: error.response.status,
						statusText: error.response.statusText,
						errors: error.response.data.errors,
					};
					AllureReporter.addAttachment('response.json', errorResponse, 'application/json');
				}
			}
			await browser.reloadSession();
		},
	},
};
exports.config = wdioConfig;
