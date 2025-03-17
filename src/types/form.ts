import type{ Dispatch, SetStateAction } from 'react';

export type formProps = {
    title: string,
    inputContents: inputContent[],
    state: any,
    action: any
}

type state<T> = {
    value: T,
    setValue: Dispatch<SetStateAction<T>>
}

export type input = {
    name: string,
    id: string,
    placeholder: string,
    inputType: string,
    state?: state<string>
}


export type select<T> = {
    name: string,
    id: string,
    options: string[],
    state?: state<T>
}

export type inputContent = input | select<any>

export function isInput(item: inputContent): item is input {
    return "inputType" in item;
}
