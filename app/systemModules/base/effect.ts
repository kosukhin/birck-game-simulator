type Constructable = abstract new (...args: any) => any

export function effect<T extends Constructable, CR = '_CR_'>(
  fn: (...props: ConstructorParameters<T>) => CR extends '_CR_' ? void : CR
) {
  return fn as <R = '_R_'>(
    ...props: ConstructorParameters<T>
  ) => R extends '_R_' ? (CR extends '_CR_' ? void : CR) : R
}
