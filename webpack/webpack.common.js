const Path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: {
		app: Path.resolve(__dirname, '../src/scripts/index.js'),
	},
	output: {
		path: Path.join(__dirname, '../build'),
		filename: 'js/[name].js',
	},
	optimization: {
		splitChunks: {
			chunks: 'all',
			name: false,
		},
	},
	plugins: [
		new CleanWebpackPlugin(),

		new CopyWebpackPlugin({
			patterns: [
				{ from: 'node_modules/libarchive.js/dist', to: 'public' },
				{ from: Path.resolve(__dirname, '../src/public'), to: 'public' },
				{ from: Path.resolve(__dirname, '../src/assets'), to: 'public' },
			],
		}),
		new HtmlWebpackPlugin({
			template: Path.resolve(__dirname, '../src/index.html'),
		}),
	],
	resolve: {
		alias: {
			'~': Path.resolve(__dirname, '../src'),
		},
	},
	module: {
		rules: [
			{
				test: /\.mjs$/,
				include: /node_modules/,
				type: 'javascript/auto',
			},
			{
				test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|7z)(\?.*)?$/,
				use: {
					loader: 'file-loader',
					options: {
						name: '[path][name].[ext]',
					},
				},
			},
		],
	},
};
