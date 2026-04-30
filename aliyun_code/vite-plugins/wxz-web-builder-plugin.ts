/**
 * 本地替代 wxz-web-builder-vite-plugin
 * 用于移除对阿里云私有 npm 包的依赖
 *
 * 原插件功能：
 * 1. JSX Inspector - 开发时为组件添加 data-* 属性（仅用于 AI 可视化编辑）
 * 2. Server Config - 开发服务器配置
 *
 * 生产环境不需要这些功能，此插件提供兼容的空实现
 */

import type { Plugin, ServerOptions } from 'vite';

/**
 * 开发模式下的 JSX Inspector 插件
 * 原插件会解析 JSX 并添加 data-component-* 属性
 * 这里提供空实现，因为生产环境不需要
 */
function jsxInspectorPlugin(): Plugin {
  return {
    name: 'wxz-jsx-inspector',
    enforce: 'pre',
    apply: 'serve', // 只在开发时应用
    transform(code: string, id: string) {
      // 只处理 TSX/JSX 文件
      if (!/\.(tsx|jsx)$/.test(id)) return null;

      // 原插件会在这里解析 AST 并注入 data-* 属性
      // 生产环境不需要此功能，直接返回原代码
      return null;
    },
  };
}

/**
 * 路由提取插件（空实现）
 */
function extractRoutesPlugin(): Plugin {
  return {
    name: 'wxz-extract-routes',
    apply: 'serve',
    configureServer() {
      // 原插件会提取路由信息供 AI 平台使用
      // 这里不需要实现
    },
  };
}

/**
 * HMR 控制插件（空实现）
 */
function hmrControlPlugin(): Plugin {
  return {
    name: 'wxz-hmr-control',
    apply: 'serve',
    handleHotUpdate({ server, modules }) {
      // 原插件会控制 HMR 行为
      // 返回 modules 让 Vite 默认处理
      return modules;
    },
  };
}

/**
 * Vite 插件集合
 * 生产构建时返回空数组，开发时返回基础插件
 */
export const WXZ_WEB_BUILDER_VITE_PLUGINS: Plugin[] = [
  jsxInspectorPlugin(),
  extractRoutesPlugin(),
  hmrControlPlugin(),
];

/**
 * 开发服务器配置
 */
export const WXZ_WEB_BUILDER_VITE_SERVER: ServerOptions = {
  host: '0.0.0.0',
  allowedHosts: true,
  port: 30101,
  cors: true,
};

export default {
  WXZ_WEB_BUILDER_VITE_PLUGINS,
  WXZ_WEB_BUILDER_VITE_SERVER,
};
