export interface deal{
    format: formats,
    name: string,
    money: string,
    dueDate: string,
    memo: string,
    status: tranStatus,
    borrowerId: string,
    lenderId: string,
    registrantId: string,
    _id: string
}

export type cardMsg = {
    msg: string
}

export type tranStatus = "未返済" | "返済済み";
export type formats =  "貸し" | "借り"