import van, { State } from 'vanjs-core'
import { Navbar } from './navbar'
import { AjaxImage, Home } from './home'
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

export const imageViewData: State<AjaxImage> = van.state({ hasStar: false, src: '' })
const imageView = ImageView(imageViewData)
export const imageViewModal = new Modal(imageView)