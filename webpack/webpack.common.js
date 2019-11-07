const path = require('path')
const MiniCssExtractPlugin = require('extract-css-chunks-webpack-plugin');  // used for packaging css into bundles

module.exports = {
	devServer: {
		contentBase: path.join(__dirname, '..', 'dist'),
		headers: {
			'Access-Control-Allow-Origin': '*'
		},
		publicPath: '/',
		host: 'localhost',
		port: 4002,
	},
	module: {
		// Loaders are processors for verifying and transformating
		// files that match the given "test" regex
		// https://webpack.js.org/concepts/loaders/
		rules: [
			/* HTML bundling rule, used mainly for plugins UI */
			{
				test: /\.html/,
				use: [
					{loader: "html-loader"}
				]
			},
			/* CSS bundling rule, using SASS */
			{
				test: /\.(s)?css$/,
				use: [
					{loader: MiniCssExtractPlugin.loader, options: {publicPath: 'css/'}},
					'css-loader',
					'sass-loader'
				]
			},
			/* image bundling rule, images are referenced via css */
			{
				test: /\.(jpg|gif|png|svg|cur)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].[ext]',
							outputPath: './css/img/',
							publicPath: 'css/img/'
						}
					}
				]
			},
			/* Javascript and JSX loading */
			{
				test: /\.(js|jsx)$/,
				exclude: [/node_modules/,/\.spec\.js$/, /translationSample/ ],
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env', '@babel/preset-react'],
					},
				}
			}
		]
	},
	externals: {
		jquery: 'jQuery',
	},

	plugins: [
		new MiniCssExtractPlugin({
			fileNname: '[name].css',
		}),
	],
	resolve: {
		extensions: ['.js', '.jsx'],
	}
}