type Constructable = abstract new (...args: any) => any

export type EffectProps<T extends Constructable> = ConstructorParameters<T>

export type Effect<T extends Constructable, R = void> = (
  ...props: EffectProps<T>
) => R
