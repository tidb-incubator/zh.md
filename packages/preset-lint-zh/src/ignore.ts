export enum IgnoreScope {
  LINE = "line",
  FILE = "all"
}

export interface IIgnore {
  path: string
  scope: IgnoreScope,
  config?: any
  ruleId: string
  line?: number

}
