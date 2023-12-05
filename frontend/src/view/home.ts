import van, { State } from 'vanjs-core'
import { apiConfig } from '../config'
import { AjaxRes } from '../util'
import { starIcon } from './star'
import { RouteEvent } from 'apee-router'

const { button, div, img } = van.tags

const imageList = van.state([]) as State<Image[]>
const bigImageSrc = van.derive(() => {
    if (imageList.val.length == 0) return ''
    return imageList.val[nowImageIndex.val].src.val
})
const btnHasStar = van.derive(() => {
    if (imageList.val.length == 0) return false
    return imageList.val[nowImageIndex.val].hasStar.val
})
const nowImageIndex = van.state(0)
interface Image {
    src: State<string>
    hasStar: State<boolean>
    index: number
}

const disabledimageList = van.state(false)

export const home: RouteEvent = route => {
    if (route.status == 1) return
    loadimageList(disabledimageList)
    loadOneWord()
    return route.status = 1
}
export const Home = () => {
    return div({ 'data-route': 'home' },
        div({ class: 'row position-relative' },
            div({ class: 'col-lg-8 mb-4 mb-lg-0' }, ImageBox(bigImageSrc)),
            div({ class: 'col-lg-4' }, RightPanel()),
        )
    )
}

const RightPanel = () => {

    const SmallImage = (image: Image) => {
        return div({ class: 'mb-3 col-6 col-sm-4 col-lg-6' },
            div({ class: 'position-relative' },
                img({
                    class: 'w-100 rounded-3', role: 'button', src: image.src, onclick() {
                        nowImageIndex.val = image.index
                    }
                }),
                () => image.hasStar.val ? starIcon() : ''
            )
        )
    }
    const starBtnText = van.derive(() => btnHasStar.val ? '取消收藏' : '收藏图片')
    const starBtnClass = van.derive(() => btnHasStar.val ? 'btn-outline-danger' : 'btn-warning')
    return div(
        div({ class: 'row mb-4' },
            div({ class: 'col col-md-6' },
                button({
                    class: 'btn btn-success w-100', disabled: disabledimageList, onclick() {
                        disabledimageList.val = true
                        loadimageList(disabledimageList)
                        loadOneWord()
                    }
                }, '再来一组')
            ),
            div({ class: 'col col-md-6' },
                button({
                    class: () => `btn w-100 ${starBtnClass.val}`,
                    onclick: clickAddStar
                }, starBtnText),
            ),
        ),
        () => div({ class: 'row' },
            imageList.val.map(image => SmallImage(image))
        ),
        div({ class: 'text-muted' }, oneWord)
    )
}

const ImageBox = (src: State<string>) => {
    return img({
        class: 'w-100 rounded-4', src
    })
}

const xhrForimageList = new XMLHttpRequest()

const loadimageList = (disable: State<boolean>) => {
    const xhr = xhrForimageList
    xhr.abort()
    xhr.open('GET', apiConfig.randomImage)
    xhr.send()
    xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState == xhr.DONE && xhr.status == 200) {
            interface AjaxImage {
                src: string
                hasStar: boolean
            }
            const data = JSON.parse(xhr.responseText) as AjaxRes<{ main: AjaxImage, list: AjaxImage[] }>
            bigImageSrc.val = data.data.main.src
            btnHasStar.val = data.data.main.hasStar
            imageList.val = data.data.list.map((item, index) => {
                return {
                    hasStar: van.state(item.hasStar),
                    index,
                    src: van.state(item.src)
                }
            })
            nowImageIndex.val = 0
            disable.val = false
        }
    })
}
const xhrForOneWord = new XMLHttpRequest()
const oneWord = van.state('')
const loadOneWord = () => {
    const xhr = xhrForOneWord
    xhr.abort()
    xhr.open('GET', 'https://v1.hitokoto.cn/?c=k&encode=text')
    xhr.send()
    xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState == xhr.DONE && xhr.status == 200) {
            oneWord.val = xhr.responseText
        }
    })
}

const xhrAddStar = new XMLHttpRequest()
const clickAddStar = () => {
    const xhr = xhrAddStar
    xhr.abort()
    xhr.open('POST', apiConfig.addStar)
    xhr.send((() => {
        const params = new URLSearchParams()
        params.set('imageSrc', bigImageSrc.val)
        return params
    })())
    xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState == xhr.DONE && xhr.status == 200) {
            const data = JSON.parse(xhr.responseText) as AjaxRes<{ hasStar: boolean }>
            let { hasStar } = data.data
            imageList.val[nowImageIndex.val].hasStar.val = hasStar
        }
    })
}

