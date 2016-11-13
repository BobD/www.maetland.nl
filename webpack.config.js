var path = require('path');
var webpack = require('webpack');
var argv = require('minimist')(process.argv.slice(2));
var outputPath = argv.ENV === 'development' ? './build/js' : './dist/js';
var componentPath = path.resolve('./src/js');

module.exports = {
     entry: './src/js/app.js',
     output: {
        path: outputPath,
        publicPath: "/js",
        filename: 'app.bundle.js',
    },
    module: {
        loaders: [
        	{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}
     	]
    },
     // See: https://seesparkbox.com/foundry/write_better_frontend_modules_with_webpack
    resolve: {
        root: componentPath,
    },

    plugins: [
        // http://stackoverflow.com/questions/28572380/conditional-build-based-on-environment-using-webpack
        new webpack.DefinePlugin({
            ENV: JSON.stringify(argv.ENV)
        }),
        new webpack.ProvidePlugin({
        })
	],
    node: {
        fs: "empty" // avoids error messages
    },
    devServer: { inline: true }
};