export type newUser = {
    familyName: string,
    firstName: string,
    sex: sexTypes,
    email: string,
    password: string
}

export type userMsg = {
    msg: string
}

export type sexTypes = "男性" | "女性" | "その他"