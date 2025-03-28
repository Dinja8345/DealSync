export type newUser = {
    id: string
    email: string,
    password: string
    familyName: string,
    firstName: string,
    sex: sexTypes,
}

export type User = {
    id: string,
    email: string,
    password: string,
    familyName: string,
    firstName: string,
    sex: sexTypes,
    _id: string,
}

export type userMsg = {
    msg: string
}

export type sexTypes = "男性" | "女性" | "その他"