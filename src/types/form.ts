import type{ Dispatch, SetStateAction } from 'react';

export type formProps = {
    title: string,
    formClass?: string
    inputContents: inputContent[],
    state: any,
    action: any
}

type state<T> = {
    value: T,
    setValue: Dispatch<SetStateAction<T>>
}

export type input<T> = {
    name: string,
    id: string,
    placeholder?: string,
    areaDisabled?: boolean,
    readOnly?: boolean,
    inputType: string,
    state?: state<T>
}

export type select<T> = {
    name: string,
    id: string,
    options: string[],
    state?: state<T>
}

export type inputContent = input<any> | select<any>

export function isInput(item: inputContent): item is input<any> {
    return "inputType" in item;
}
