import { Router } from 'apee-router'
import { navLinks } from './tag/navbar'
import { apiConfig } from './config'
import { AjaxRes } from './util'

/** 在路由系统启动后执行 */
export const afterRouter = (router: Router) => {
    type RouteName = keyof typeof navLinks
    const handle = () => {
        let nowRouteName = router.getNowRouteName() as RouteName
        for (let name in navLinks) {
            if (name == nowRouteName) navLinks[nowRouteName].classList.add('active')
            else navLinks[name as RouteName].classList.remove('active')
        }
    }
    window.addEventListener('hashchange', handle)
    handle()
    handleLogin()
}


const handleLogin = () => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', apiConfig.login)
    xhr.send()
    xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState == xhr.DONE && xhr.status == 200) {
            const data = JSON.parse(xhr.responseText) as AjaxRes
            if (data.code == 200) handleHasLogin()
            else handleNotLogin()
        }
    })
}

const handleHasLogin = () => {
    navLinks.login.classList.add('d-none')
    navLinks.logout.classList.remove('d-none')
}

const handleNotLogin = () => {
    navLinks.login.classList.remove('d-none')
    navLinks.logout.classList.add('d-none')
}