const path = require("path");

module.exports = {
  mode: "production", // Set the mode to production for optimization
  entry: "./app/page.js", // Adjust the entry point for your app's entry file
  output: {
    path: path.resolve(__dirname, ".raectflow"), // Set the build folder as output directory
    filename: (pathData) => {
      // Dynamically create output paths based on input structure
      const pathSegments = pathData.chunk.name.split("/");
      return `${pathSegments[pathSegments.length - 1]}.js`; // Output file for each chunk
    },
    clean: true, // Automatically clean the output folder before each build
  },
  resolve: {
    extensions: [".js", ".jsx", ".json"], // Resolve extensions for JavaScript and JSX
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Process JavaScript files
        exclude: /node_modules/,
        use: "babel-loader", // Use Babel to transpile JavaScript (adjust with your config)
      },
    ],
  },
  devtool: "source-map", // Enable source maps for debugging
};
