import * as path from "path";
import { fileURLToPath } from "url";
import TerserPlugin from "terser-webpack-plugin";

const dev = process.env.NODE_ENV == "development";
const cwd = path.dirname(fileURLToPath(import.meta.url));

export default {
  entry: "./src/index.js",
  mode: dev ? "development" : "production",
  output: {
    path: path.resolve(cwd, "dist"),
    filename: "lightelement.js",
    library: {
      name: "LightElement",
      type: "umd",
      export: "default",
    },
    globalObject: "this",
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      terserOptions: {
        keep_classnames: true,
        keep_fnames: true,
        compress: {
          drop_console: !dev,
        },
      },
    })],
  },
};
