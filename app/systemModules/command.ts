class Command {
  constructor(
    public command: (...args: any) => any,
    public args: Parameters<typeof command> = []
  ) {}
}

const commandsQueue: Command[] = []

export function cmd(...p: ConstructorParameters<typeof Command>) {
  commandsQueue.push(new Command(...p))
}

let queueCommandsProcessorId: unknown = null

export function startCommandsProcessor(periodMs = 60) {
  if (queueCommandsProcessorId) {
    clearInterval(queueCommandsProcessorId as number)
  }

  const _process = () => {
    queueCommandsProcessorId = setTimeout(() => {
      requestAnimationFrame(() => {
        const begin = new Date().getTime()
        let lasts = 0

        console.log(commandsQueue.length, lasts)
        while (commandsQueue.length && lasts < periodMs) {
          const command = commandsQueue.shift()
          command && command.command(...command.args)
          lasts = new Date().getTime() - begin
        }
        _process()
      })
    }, periodMs)
  }

  _process()
}

export function stopCommandsProcessor() {
  if (queueCommandsProcessorId) {
    clearInterval(queueCommandsProcessorId as number)
  }
}
