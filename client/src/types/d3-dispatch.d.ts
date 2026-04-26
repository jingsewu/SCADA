declare module 'd3-dispatch' {
  export function dispatch<T extends string>(...types: T[]): any;
}
