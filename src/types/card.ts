export type content = {
    name: string,
    id: string,
    placeholder: string,
    inputType: string
}

export type CardProps = {
    title: string,
    contents: content[]
}