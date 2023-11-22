/// <reference types="vite/client"/>
import 'bootstrap/dist/css/bootstrap.css'
import van from 'vanjs-core'
const { button, div } = van.tags

const App = () => {
    return div(
        div({ class: 'm-5' }, button({
            class: 'btn btn-success',
            onclick: () => {
                alert('你好')
            }
        }, '点我'))
    )
}

van.add(document.body, App())