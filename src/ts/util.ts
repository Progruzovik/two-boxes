export const enum Box {
    Tom,
    Jenny
}

export interface Item {
    readonly name: string
    readonly box: Box
}
