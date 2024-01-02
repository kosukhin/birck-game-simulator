export class MountedHook {
  constructor(public fn: () => any) {}
}

export const mountedHook: (
  ...p: ConstructorParameters<typeof MountedHook>
) => void = (fn) => {
  onMounted(fn)
}
