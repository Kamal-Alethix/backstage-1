'use strict';

var fs = require('fs-extra');
var path = require('path');
var ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
var runScriptWebpackPlugin = require('run-script-webpack-plugin');
var webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');
var cliCommon = require('@backstage/cli-common');
var getPackages = require('@manypkg/get-packages');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var svgrTemplate = require('./svgrTemplate-550efce6.cjs.js');
var index = require('./index-a5d56062.cjs.js');
var run = require('./run-3d0b00b7.cjs.js');
var ESLintPlugin = require('eslint-webpack-plugin');
var pickBy = require('lodash/pickBy');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var ForkTsCheckerWebpackPlugin__default = /*#__PURE__*/_interopDefaultLegacy(ForkTsCheckerWebpackPlugin);
var HtmlWebpackPlugin__default = /*#__PURE__*/_interopDefaultLegacy(HtmlWebpackPlugin);
var ModuleScopePlugin__default = /*#__PURE__*/_interopDefaultLegacy(ModuleScopePlugin);
var webpack__default = /*#__PURE__*/_interopDefaultLegacy(webpack);
var nodeExternals__default = /*#__PURE__*/_interopDefaultLegacy(nodeExternals);
var MiniCssExtractPlugin__default = /*#__PURE__*/_interopDefaultLegacy(MiniCssExtractPlugin);
var ESLintPlugin__default = /*#__PURE__*/_interopDefaultLegacy(ESLintPlugin);
var pickBy__default = /*#__PURE__*/_interopDefaultLegacy(pickBy);

const { ESBuildMinifyPlugin } = require("esbuild-loader");
const optimization = (options) => {
  const { isDev } = options;
  return {
    minimize: !isDev,
    minimizer: [
      new ESBuildMinifyPlugin({
        target: "es2019",
        format: "iife"
      })
    ],
    runtimeChunk: "single",
    splitChunks: {
      automaticNameDelimiter: "-",
      cacheGroups: {
        default: false,
        packages: {
          chunks: "initial",
          test(module) {
            var _a;
            return Boolean((_a = module == null ? void 0 : module.resource) == null ? void 0 : _a.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/));
          },
          name(module) {
            const packageName = module.resource.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
            return packageName.replace("@", "");
          },
          filename: isDev ? "module-[name].js" : "static/module-[name].[chunkhash:8].js",
          priority: 10,
          minSize: 1e5,
          minChunks: 1,
          maxAsyncRequests: Infinity,
          maxInitialRequests: Infinity
        },
        vendor: {
          chunks: "initial",
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          priority: 5,
          enforce: true
        }
      }
    }
  };
};

const transforms = (options) => {
  const { isDev, isBackend } = options;
  const extraTransforms = isDev && !isBackend ? ["react-hot-loader"] : [];
  function insertBeforeJssStyles(element) {
    const head = document.head;
    const firstJssNode = head.querySelector("style[data-jss]");
    if (!firstJssNode) {
      head.appendChild(element);
    } else {
      head.insertBefore(element, firstJssNode);
    }
  }
  const loaders = [
    {
      test: /\.(tsx?)$/,
      exclude: /node_modules/,
      loader: require.resolve("@sucrase/webpack-loader"),
      options: {
        transforms: ["typescript", "jsx", ...extraTransforms],
        disableESTransforms: true,
        production: !isDev
      }
    },
    {
      test: /\.(jsx?|mjs|cjs)$/,
      exclude: /node_modules/,
      loader: require.resolve("@sucrase/webpack-loader"),
      options: {
        transforms: ["jsx", ...extraTransforms],
        disableESTransforms: true,
        production: !isDev
      }
    },
    {
      test: /\.(js|mjs|cjs)/,
      resolve: {
        fullySpecified: false
      }
    },
    {
      test: [/\.icon\.svg$/],
      use: [
        {
          loader: require.resolve("@sucrase/webpack-loader"),
          options: {
            transforms: ["jsx", ...extraTransforms],
            disableESTransforms: true,
            production: !isDev
          }
        },
        {
          loader: require.resolve("@svgr/webpack"),
          options: { babel: false, template: svgrTemplate.svgrTemplate }
        }
      ]
    },
    {
      test: [
        /\.bmp$/,
        /\.gif$/,
        /\.jpe?g$/,
        /\.png$/,
        /\.frag/,
        { and: [/\.svg/, { not: [/\.icon\.svg/] }] },
        /\.xml/
      ],
      type: "asset/resource",
      generator: {
        filename: "static/[name].[hash:8].[ext]"
      }
    },
    {
      test: /\.(eot|woff|woff2|ttf)$/i,
      type: "asset/resource",
      generator: {
        filename: "static/[name].[hash][ext][query]"
      }
    },
    {
      test: /\.ya?ml$/,
      use: require.resolve("yml-loader")
    },
    {
      include: /\.(md)$/,
      type: "asset/resource",
      generator: {
        filename: "static/[name].[hash][ext][query]"
      }
    },
    {
      test: /\.css$/i,
      use: [
        isDev ? {
          loader: require.resolve("style-loader"),
          options: {
            insert: insertBeforeJssStyles
          }
        } : MiniCssExtractPlugin__default["default"].loader,
        {
          loader: require.resolve("css-loader"),
          options: {
            sourceMap: true
          }
        }
      ]
    }
  ];
  const plugins = new Array();
  if (isDev) {
    plugins.push(new webpack__default["default"].HotModuleReplacementPlugin());
  } else {
    plugins.push(new MiniCssExtractPlugin__default["default"]({
      filename: "static/[name].[contenthash:8].css",
      chunkFilename: "static/[name].[id].[contenthash:8].css",
      insert: insertBeforeJssStyles
    }));
  }
  return { loaders, plugins };
};

class LinkedPackageResolvePlugin {
  constructor(targetModules, packages) {
    this.targetModules = targetModules;
    this.packages = packages;
  }
  apply(resolver) {
    resolver.hooks.resolve.tapAsync("LinkedPackageResolvePlugin", (data, context, callback) => {
      var _a;
      const pkg = this.packages.find((pkge) => data.path && cliCommon.isChildPath(pkge.dir, data.path));
      if (!pkg) {
        callback();
        return;
      }
      const modulesLocation = path.resolve(this.targetModules, pkg.packageJson.name);
      const newContext = ((_a = data.context) == null ? void 0 : _a.issuer) ? {
        ...data.context,
        issuer: data.context.issuer.replace(pkg.dir, modulesLocation)
      } : data.context;
      resolver.doResolve(resolver.hooks.resolve, {
        ...data,
        context: newContext,
        path: data.path && data.path.replace(pkg.dir, modulesLocation)
      }, `resolve ${data.request} in ${modulesLocation}`, context, callback);
    });
  }
}

function resolveBaseUrl(config) {
  const baseUrl = config.getString("app.baseUrl");
  try {
    return new URL(baseUrl);
  } catch (error) {
    throw new Error(`Invalid app.baseUrl, ${error}`);
  }
}
async function readBuildInfo() {
  const timestamp = Date.now();
  let commit = "unknown";
  try {
    commit = await run.runPlain("git", "rev-parse", "HEAD");
  } catch (error) {
    console.warn(`WARNING: Failed to read git commit, ${error}`);
  }
  let gitVersion = "unknown";
  try {
    gitVersion = await run.runPlain("git", "describe", "--always");
  } catch (error) {
    console.warn(`WARNING: Failed to describe git version, ${error}`);
  }
  const { version: packageVersion } = await fs__default["default"].readJson(index.paths.resolveTarget("package.json"));
  return {
    cliVersion: index.version,
    gitVersion,
    packageVersion,
    timestamp,
    commit
  };
}
async function createConfig(paths, options) {
  const { checksEnabled, isDev, frontendConfig } = options;
  const { plugins, loaders } = transforms(options);
  const { packages } = await getPackages.getPackages(index.paths.targetDir);
  const externalPkgs = packages.filter((p) => !cliCommon.isChildPath(paths.root, p.dir));
  const baseUrl = frontendConfig.getString("app.baseUrl");
  const validBaseUrl = new URL(baseUrl);
  const publicPath = validBaseUrl.pathname.replace(/\/$/, "");
  if (checksEnabled) {
    plugins.push(new ForkTsCheckerWebpackPlugin__default["default"]({
      typescript: { configFile: paths.targetTsConfig, memoryLimit: 4096 }
    }), new ESLintPlugin__default["default"]({
      context: paths.targetPath,
      files: ["**", "!**/__tests__/**", "!**/?(*.)(spec|test).*"]
    }));
  }
  plugins.push(new webpack.ProvidePlugin({
    process: "process/browser",
    Buffer: ["buffer", "Buffer"]
  }));
  plugins.push(new webpack__default["default"].EnvironmentPlugin({
    APP_CONFIG: options.frontendAppConfigs
  }));
  plugins.push(new HtmlWebpackPlugin__default["default"]({
    template: paths.targetHtml,
    templateParameters: {
      publicPath,
      config: frontendConfig
    }
  }));
  const buildInfo = await readBuildInfo();
  plugins.push(new webpack__default["default"].DefinePlugin({
    "process.env.BUILD_INFO": JSON.stringify(buildInfo)
  }));
  const resolveAliases = {};
  try {
    const { version: reactDomVersion } = require("react-dom/package.json");
    if (reactDomVersion.startsWith("16.")) {
      resolveAliases["react-dom"] = "@hot-loader/react-dom-v16";
    } else {
      resolveAliases["react-dom"] = "@hot-loader/react-dom-v17";
    }
  } catch (error) {
    console.warn(`WARNING: Failed to read react-dom version, ${error}`);
  }
  return {
    mode: isDev ? "development" : "production",
    profile: false,
    optimization: optimization(options),
    bail: false,
    performance: {
      hints: false
    },
    devtool: isDev ? "eval-cheap-module-source-map" : "source-map",
    context: paths.targetPath,
    entry: [require.resolve("react-hot-loader/patch"), paths.targetEntry],
    resolve: {
      extensions: [".ts", ".tsx", ".mjs", ".js", ".jsx"],
      mainFields: ["browser", "module", "main"],
      fallback: {
        ...pickBy__default["default"](require("node-libs-browser")),
        module: false,
        dgram: false,
        dns: false,
        fs: false,
        http2: false,
        net: false,
        tls: false,
        child_process: false,
        path: false,
        https: false,
        http: false,
        util: require.resolve("util/")
      },
      plugins: [
        new LinkedPackageResolvePlugin(paths.rootNodeModules, externalPkgs),
        new ModuleScopePlugin__default["default"]([paths.targetSrc, paths.targetDev], [paths.targetPackageJson])
      ],
      alias: resolveAliases
    },
    module: {
      rules: loaders
    },
    output: {
      path: paths.targetDist,
      publicPath: `${publicPath}/`,
      filename: isDev ? "[name].js" : "static/[name].[fullhash:8].js",
      chunkFilename: isDev ? "[name].chunk.js" : "static/[name].[chunkhash:8].chunk.js",
      ...isDev ? {
        devtoolModuleFilenameTemplate: (info) => `file:///${path.resolve(info.absoluteResourcePath).replace(/\\/g, "/")}`
      } : {}
    },
    plugins
  };
}
async function createBackendConfig(paths, options) {
  const { checksEnabled, isDev } = options;
  const { packages } = await getPackages.getPackages(index.paths.targetDir);
  const localPackageNames = packages.map((p) => p.packageJson.name);
  const moduleDirs = packages.map((p) => path.resolve(p.dir, "node_modules"));
  const externalPkgs = packages.filter((p) => !cliCommon.isChildPath(paths.root, p.dir));
  const { loaders } = transforms({ ...options, isBackend: true });
  const runScriptNodeArgs = new Array();
  if (options.inspectEnabled) {
    runScriptNodeArgs.push("--inspect");
  } else if (options.inspectBrkEnabled) {
    runScriptNodeArgs.push("--inspect-brk");
  }
  return {
    mode: isDev ? "development" : "production",
    profile: false,
    ...isDev ? {
      watch: true,
      watchOptions: {
        ignored: /node_modules\/(?!\@backstage)/
      }
    } : {},
    externals: [
      nodeExternalsWithResolve({
        modulesDir: paths.rootNodeModules,
        additionalModuleDirs: moduleDirs,
        allowlist: ["webpack/hot/poll?100", ...localPackageNames]
      })
    ],
    target: "node",
    node: {
      __dirname: true,
      __filename: true,
      global: true
    },
    bail: false,
    performance: {
      hints: false
    },
    devtool: isDev ? "eval-cheap-module-source-map" : "source-map",
    context: paths.targetPath,
    entry: [
      "webpack/hot/poll?100",
      paths.targetRunFile ? paths.targetRunFile : paths.targetEntry
    ],
    resolve: {
      extensions: [".ts", ".tsx", ".mjs", ".js", ".jsx"],
      mainFields: ["main"],
      modules: [paths.rootNodeModules, ...moduleDirs],
      plugins: [
        new LinkedPackageResolvePlugin(paths.rootNodeModules, externalPkgs),
        new ModuleScopePlugin__default["default"]([paths.targetSrc, paths.targetDev], [paths.targetPackageJson])
      ],
      alias: {
        "react-dom": "@hot-loader/react-dom"
      }
    },
    module: {
      rules: loaders
    },
    output: {
      path: paths.targetDist,
      filename: isDev ? "[name].js" : "[name].[hash:8].js",
      chunkFilename: isDev ? "[name].chunk.js" : "[name].[chunkhash:8].chunk.js",
      ...isDev ? {
        devtoolModuleFilenameTemplate: (info) => `file:///${path.resolve(info.absoluteResourcePath).replace(/\\/g, "/")}`
      } : {}
    },
    plugins: [
      new runScriptWebpackPlugin.RunScriptWebpackPlugin({
        name: "main.js",
        nodeArgs: runScriptNodeArgs.length > 0 ? runScriptNodeArgs : void 0,
        args: process.argv.slice(3)
      }),
      new webpack__default["default"].HotModuleReplacementPlugin(),
      ...checksEnabled ? [
        new ForkTsCheckerWebpackPlugin__default["default"]({
          typescript: { configFile: paths.targetTsConfig }
        }),
        new ESLintPlugin__default["default"]({
          files: ["**", "!**/__tests__/**", "!**/?(*.)(spec|test).*"]
        })
      ] : []
    ]
  };
}
function nodeExternalsWithResolve(options) {
  let currentContext;
  const externals = nodeExternals__default["default"]({
    ...options,
    importType(request) {
      const resolved = require.resolve(request, {
        paths: [currentContext]
      });
      return `commonjs ${resolved}`;
    }
  });
  return ({ context, request }, callback) => {
    currentContext = context;
    return externals(context, request, callback);
  };
}

function resolveBundlingPaths(options) {
  const { entry, targetDir = index.paths.targetDir } = options;
  const resolveTargetModule = (pathString) => {
    for (const ext of ["mjs", "js", "ts", "tsx", "jsx"]) {
      const filePath = path.resolve(targetDir, `${pathString}.${ext}`);
      if (fs__default["default"].pathExistsSync(filePath)) {
        return filePath;
      }
    }
    return path.resolve(targetDir, `${pathString}.js`);
  };
  let targetPublic = void 0;
  let targetHtml = path.resolve(targetDir, "public/index.html");
  if (fs__default["default"].pathExistsSync(targetHtml)) {
    targetPublic = path.resolve(targetDir, "public");
  } else {
    targetHtml = path.resolve(targetDir, `${entry}.html`);
    if (!fs__default["default"].pathExistsSync(targetHtml)) {
      targetHtml = index.paths.resolveOwn("templates/serve_index.html");
    }
  }
  const targetRunFile = path.resolve(targetDir, "src/run.ts");
  const runFileExists = fs__default["default"].pathExistsSync(targetRunFile);
  return {
    targetHtml,
    targetPublic,
    targetPath: path.resolve(targetDir, "."),
    targetRunFile: runFileExists ? targetRunFile : void 0,
    targetDist: path.resolve(targetDir, "dist"),
    targetAssets: path.resolve(targetDir, "assets"),
    targetSrc: path.resolve(targetDir, "src"),
    targetDev: path.resolve(targetDir, "dev"),
    targetEntry: resolveTargetModule(entry),
    targetTsConfig: index.paths.resolveTargetRoot("tsconfig.json"),
    targetPackageJson: path.resolve(targetDir, "package.json"),
    rootNodeModules: index.paths.resolveTargetRoot("node_modules"),
    root: index.paths.targetRoot
  };
}

exports.createBackendConfig = createBackendConfig;
exports.createConfig = createConfig;
exports.resolveBaseUrl = resolveBaseUrl;
exports.resolveBundlingPaths = resolveBundlingPaths;
//# sourceMappingURL=paths-fed28365.cjs.js.map
