export type outputContent = {
    format: formats,
    name: string,
    money: string,
    dueDate: string,
    memo: string,
    status: tranStatus,
    _id: string
}


export type buttonProps = {
    text?: string
}

export type cardMsg = {
    msg: string
}

export type tranStatus = "未返済" | "返済済み";
export type formats =  "貸し" | "借り"