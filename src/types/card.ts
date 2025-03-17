export type outputContent = {
    format: string,
    name: string,
    money: string,
    dueDate: string,
    memo: string,
    status: tranStatus,
    id: string
}

export type tranStatus = "未返済" | "返済済み";

export type buttonProps = {
    text?: string
}

export type cardMsg = {
    msg: string
}

