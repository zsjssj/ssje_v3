/// <reference types="vite/client" />
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const vueComponent: DefineComponent<{}, {}, any>
  export default vueComponent
}
declare module '*.glsl' {
  const value: string
  export default value
}

// declare module 'cesium' {
//   // 添加需要使用的 Cesium 类型
//   // Ion
//   // Cesium3DTileset, Camera
//   import * as Cesium from 'cesium'
//   export default Cesium
// }
