export const enum Box {
    Tom = "tom's",
    Jenny = "jenny's"
}

export interface Item {
    readonly name: string
    readonly box: Box
}
