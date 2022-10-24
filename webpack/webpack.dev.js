module.exports = {
	mode: 'development',
	output: {
		publicPath: '/',
	},
	devServer: {
		hot: true,
		open: true,
		historyApiFallback: true,
	},
	devtool: 'cheap-module-source-map',
}
