import Operation from "./Operation"

type ConstructorArgs = {
  afterHref: string;
} & ConstructorParameters<typeof Operation>[0]

export default class AddDataBeforeHrefOperation extends Operation {

  readonly afterHref: string

  constructor({ afterHref, ...rest }: ConstructorArgs) {
    super(rest)
    this.afterHref = afterHref
  }
}
