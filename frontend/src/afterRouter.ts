import { Router } from 'apee-router'
import { navLinks } from './view/navbar'


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
    
}

