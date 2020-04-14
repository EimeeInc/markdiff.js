import Operation from "./Operation"

type ConstructorArgs = {
  afterTagName: string;
} & ConstructorParameters<typeof Operation>[0]

export default class AddDataBeforeTagNameOperation extends Operation {

  readonly afterTagName: string

  constructor({ afterTagName, ...rest }: ConstructorArgs) {
    super(rest)
    this.afterTagName = afterTagName
  }
}
