import van from 'vanjs-core'
import { Navbar } from './navbar'

const { div } = van.tags

export const App = () => {
    return div(
        Navbar(),
        div({ class: 'container' },
            div({ 'data-route': 'home' }),
            div({ 'data-route': 'star' }),
            div({ 'data-route': 'about' }),
            div({ 'data-route': 'login' }),
        )
    )
}