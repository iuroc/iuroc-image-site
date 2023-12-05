import van, { State } from 'vanjs-core'

const { div, input } = van.tags

export type FormConfigEvent = (event: { target: HTMLInputElement }) => void
export type FormConfigString = string | State<string>
export type FormConfigBoolean = boolean | State<boolean>
export interface FormConfigItem {
    value?: FormConfigString
    placeholder?: FormConfigString
    oninput?: FormConfigEvent
    onblur?: FormConfigEvent
    invalid?: FormConfigBoolean
    invalidMessage?: FormConfigString
}
export type FormConfig = Record<string, FormConfigItem>

export const MyInput = (config: FormConfigItem) => {
    const invalid = config.invalid as State<boolean>
    const classValue = () => `form-control${invalid.val ? '' : ' is-invalid'}`
    return div({ class: 'mb-3' },
        input({
            class: classValue,
            value: config.value ?? null,
            placeholder: config.value ?? null,
            oninput: config.oninput ?? null,
            onblur: config.onblur ?? null
        }),
        div({ class: 'invalid-feedback' }, config.invalidMessage)
    )
}

export const myOnBlur = (config: FormConfigItem) => {
    let value = config.value as State<string>
    let invalid = config.invalid as State<boolean>
    if (value.val == '') invalid.val = true
}

export const myOnInput = (event: { target: HTMLInputElement }, config: FormConfigItem) => {
    let value = config.value as State<string>
    let invalid = config.invalid as State<boolean>
    value.val = event.target.value
    invalid.val = false
}