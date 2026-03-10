# React Fiber 基础查找 Demo

## 概述

本 Demo 展示如何在运行时通过**组件名称**找到另一个 React 应用中的组件。

## 场景

- **左侧**：目标应用（模拟"别人的"React 应用）
- **右侧**：控制面板（我们的查找工具）

## 核心原理

React Fiber 是 React 的核心算法实现。每个渲染的 DOM 元素都关联着一个 Fiber 节点，我们可以通过以下方式找到目标组件：

1. 获取 React 根节点的 Fiber
2. 遍历 Fiber 树
3. 通过 `componentName` 或 `displayName` 匹配

## 关键代码

```typescript
// 从 DOM 元素获取 Fiber
function findFiberByDomElement(domElement: Element): Fiber | null {
  const key = Object.keys(domElement).find(k => k.startsWith('__reactFiber'));
  return domElement[key];
}

// 通过组件名查找
function findFiberByComponentName(rootFiber: Fiber, name: string): Fiber | null {
  // 遍历 Fiber 树...
}
```

## 运行

```bash
pnpm install
pnpm start
```

## 功能

在右侧控制面板：
1. 输入组件名称（如 `Counter`）
2. 点击"查找"按钮
3. 查看找到的组件信息
