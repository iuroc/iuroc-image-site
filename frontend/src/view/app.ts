import van from 'vanjs-core'
import { Navbar } from './navbar'
import { Home } from './home'
import { Star } from './star'
import { About } from './about'
import { Login } from './loginV2'

const { div } = van.tags

export const App = () => {
    return div({ ondragstart: () => false },
        Navbar(),
        div({ class: 'container py-4' },
            Home(),
            Star(),
            About(),
            Login()
        )
    )
}