const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Observar arquivos do monorepo para hot reloading compartilhado
config.watchFolders = [monorepoRoot];

// 2. Resolução de módulos priorizando local e caindo para a raiz
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// 3. Mapeamento explícito do pacote @trampotaxa/shared
config.resolver.extraNodeModules = {
  '@trampotaxa/shared': path.resolve(monorepoRoot, 'packages/shared/src'),
};

module.exports = config;
