const Encore = require('@symfony/webpack-encore');

Encore
	.setOutputPath('public/')
	.setPublicPath('/bundles/markocupiccontaosidebarnavigation')
	.setManifestKeyPrefix('')

	//.addEntry('backend', './assets/backend.js')
	//.addEntry('frontend', './assets/frontend.js')

	.copyFiles({
		from: './assets/css',
		to: 'css/[path][name].[hash:8].[ext]',
		pattern: /(style\.css)$/,
	})
	.copyFiles({
		from: './assets/js',
		to: 'js/[path][name].[hash:8].[ext]',
	})

	.disableSingleRuntimeChunk()
	.cleanupOutputBeforeBuild()
	.enableSourceMaps()
	.enableVersioning()

	// enables @babel/preset-env polyfills
	.configureBabelPresetEnv((config) => {
		config.useBuiltIns = 'usage';
		config.corejs = 3;
	})

	.enablePostCssLoader()
;

module.exports = Encore.getWebpackConfig();
