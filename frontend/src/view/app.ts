import van from 'vanjs-core'
import { Navbar } from './navbar'
import { Home } from './home'
import { Star } from './star'
import { About } from './about'
import { Login } from './login'
import { ImageView } from './modal'
import { Modal } from 'bootstrap'

const { div } = van.tags

export const App = () => {
    return div({ ondragstart: () => false },
        Navbar(),
        div({ class: 'container py-4' },
            Home(),
            Star(),
            About(),
            Login()
        ),
        imageView
    )
}

export const imageViewSrc = van.state('')
const imageView = ImageView(imageViewSrc)
export const imageViewModal = new Modal(imageView)