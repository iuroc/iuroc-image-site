import van from 'vanjs-core'
import { apiConfig, siteInfo } from '../config'

const { a, button, div, li, nav, span, ul } = van.tags

export const navLinks = {
    home: a({ class: 'nav-link', href: '#' }, '主页'),
    star: a({ class: 'nav-link', href: '#/star' }, '收藏中心'),
    about: a({ class: 'nav-link', href: '#/about' }, '关于本站'),
    logout: a({ class: 'nav-link d-none', href: apiConfig.logout }, '退出登录'),
    login: a({ class: 'nav-link d-none', href: '#/login' }, '用户登录')
}

export const Navbar = () => {

    return nav({ class: 'navbar navbar-expand-md bg-body-tertiary shadow-sm' },
        div({ class: 'container' },
            a({ class: 'navbar-brand', href: '#' }, siteInfo.name),
            button({
                class: 'navbar-toggler',
                'data-bs-toggle': 'collapse',
                'data-bs-target': '#navbarSupportedContent'
            }, span({ class: 'navbar-toggler-icon' })),
            div({ class: 'collapse navbar-collapse', id: 'navbarSupportedContent' },
                ul({ class: 'navbar-nav me-auto mb-2 mb-md-0' },
                    li({ class: 'nav-item' }, navLinks.home),
                    li({ class: 'nav-item' }, navLinks.star),
                    li({ class: 'nav-item' }, navLinks.about),
                ),
                ul({ class: 'navbar-nav' },
                    li({ class: 'nav-item' }, navLinks.logout),
                    li({ class: 'nav-item' }, navLinks.login)
                )
            )
        )
    )
}
