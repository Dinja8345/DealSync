export type outputContent = {
    format: string,
    name: string,
    money: string,
    dueDate: string,
}

export type input = {
    name: string,
    id: string,
    placeholder: string,
    inputType: string
}

export type select = {
    name: string,
    id: string,
    options: string[]
}

export type inputContent = input | select

export type inputCardProps = {
    title: string,
    inputContents: inputContent[]
}

export type cardMsg = {
    msg: string
}

export function isInput(item: inputContent): item is input {
    return "inputType" in item;
}