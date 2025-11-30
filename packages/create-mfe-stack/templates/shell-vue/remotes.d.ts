// Type declarations for remote modules loaded via Module Federation

declare module 'remote1/App' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
