const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
	entry: path.resolve(__dirname, '..', './src/index.tsx'),
	resolve: {
		extensions: ['.tsx', '.ts', '.js', '.jsx'],
		modules: [
			path.resolve(__dirname, '..', 'node_modules'),
			path.resolve(__dirname, '..', './'),
		],
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, '..', 'dist'),
		publicPath: '/',
	},
	module: {
		rules: [
			{
				test: /\.(ts|js)x?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.s?css$/,
				use: [
					{ loader: MiniCssExtractPlugin.loader },
					{
						loader: 'css-loader',
						options: {
							esModule: true,
							modules: {
								localIdentName: '[local]--[hash:base64:5]',
								namedExport: true,
							},
						},
					},
					'sass-loader',
				],
			},
			{
				test: /\.(png|jpg|gif)$/i,
				type: 'asset/resource',
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, '..', './src/index.html'),
		}),
		new MiniCssExtractPlugin(),
		new Dotenv(),
	],
}
