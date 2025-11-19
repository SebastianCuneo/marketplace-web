const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Permitir imports desde packages/shared
      webpackConfig.resolve.plugins = webpackConfig.resolve.plugins.filter(
        plugin => plugin.constructor.name !== 'ModuleScopePlugin'
      );

      // Agregar regla para procesar TS/TSX de shared
      const oneOfRule = webpackConfig.module.rules.find(rule => rule.oneOf);
      if (oneOfRule) {
        const tsxRule = oneOfRule.oneOf.find(
          rule => rule.test && rule.test.toString().includes('tsx')
        );
        
        if (tsxRule) {
          tsxRule.include = [
            tsxRule.include,
            path.resolve(__dirname, '../shared')
          ];
        }
      }

      return webpackConfig;
    },
  },
};

