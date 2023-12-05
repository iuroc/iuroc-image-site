import van from 'vanjs-core'
import image from '../../img/8ad490e1027d45f09f26c5d94f768b8a_3-min.png'
const { a, div, hr, img, li } = van.tags

export const About = () => {
    let url1 = 'https://hitokoto.cn/'
    let url2 = 'https://github.com/iuroc/iuroc-image-site'
    return div({ 'data-route': 'about' },
        div({ class: 'fs-3 mb-4' }, '关于本站'),
        img({ src: image, class: 'mb-3 rounded-4', style: 'max-width: 500px;' }),
        div({ class: 'mb-3' }, '本站是一个精心打造的图片分享平台，为您提供绝佳的视觉体验。'),
        div({ class: 'mb-3' }, '在这里，您可以轻松收藏精选图库，查看丰富的图片分类。'),
        div({ class: 'mb-3' }, '我们采用了先进的技术，基于 Spring Boot、Van.js、ApeeRouter 以及 Vite.js 开发完成，以确保您享受到高效、流畅的服务。'),
        div({ class: 'mb-3' }, '愿您在这里发现美的无限可能，感受图片带来的独特魅力。感谢您的光临！'),
        hr(),
        li({ class: 'text-muted' }, '随机一言接口：', a({ href: url1 }, url1)),
        li({ class: 'text-muted' }, '本项目开源：', a({ href: url2 }, url2))
    )
}