import van, { State } from 'vanjs-core'
import { apiConfig } from '../config'
import { AjaxRes } from '../util'

const { button, div, img } = van.tags
const { svg, path } = van.tagsNS('http://www.w3.org/2000/svg')

const bigImageSrc = van.state('')
type Image = { src: string, hasStar: boolean, index: number }
const imageSrcList = [] as State<string>[]
const imageHasStarList = [] as State<boolean>[]
const nowImageIndex = van.state(0)
const nowImage = van.derive<Image>(() => {
    return {
        src: imageSrcList[nowImageIndex.val].val,
        hasStar: imageHasStarList[nowImageIndex.val].val,
        index: nowImageIndex.val
    }
})

for (let i = 0; i < 6; i++) {
    imageSrcList.push(van.state(''))
    imageHasStarList.push(van.state(false))
}

const disabledImageList = van.state(false)
export const Home = () => {
    bigImageSrc.val = 'image/1.jpg'
    loadImageList(disabledImageList)
    loadOneWord()
    return div({ 'data-route': 'home' },
        div({ class: 'row position-relative' },
            div({ class: 'col-lg-8 mb-4 mb-lg-0' }, ImageBox(bigImageSrc)),
            div({ class: 'col-lg-4' }, RightPanel()),
        )
    )
}

const RightPanel = () => {
    const starIcon = () => div({ class: 'position-absolute', style: 'bottom: 10px; right: 10px;' },
        svg({ width: "16", height: "16", fill: "#ffc107", class: "bi bi-star-fill", viewBox: "0 0 16 16" },
            path({ "d": "M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" }),
        )
    )
    const SmallImage = (src: State<string>, hasStar: State<boolean>) => {
        return div({ class: 'mb-3 col-6 col-sm-4 col-lg-6' },
            div({ class: 'position-relative' },
                img({
                    class: 'w-100 rounded-3', role: 'button', src: src, onclick() {
                        bigImageSrc.val = src.val
                        btnHasStar.val = hasStar.val
                    }
                }),
                () => hasStar.val ? starIcon() : ''
            )
        )
    }
    const starBtnText = van.derive(() => btnHasStar.val ? '取消收藏' : '收藏图片')
    const starBtnClass = van.derive(() => btnHasStar.val ? 'btn-outline-danger' : 'btn-warning')
    return div(
        div({ class: 'row mb-4' },
            div({ class: 'col col-md-6' },
                button({
                    class: 'btn btn-success w-100', disabled: disabledImageList, onclick() {
                        disabledImageList.val = true
                        loadImageList(disabledImageList)
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
        div({ class: 'row' },
            imageSrcList.map((src, index) => SmallImage(src, imageHasStarList[index]))
        ),
        div({ class: 'text-muted' }, oneWord)
    )
}

const ImageBox = (src: State<string>) => {
    return img({
        class: 'w-100 rounded-4', src
    })
}

const xhrForImageList = new XMLHttpRequest()
const btnHasStar = van.state(false)
const loadImageList = (disable: State<boolean>) => {
    const xhr = xhrForImageList
    xhr.abort()
    xhr.open('GET', apiConfig.randomImage)
    xhr.send()
    xhr.addEventListener('readystatechange', () => {

        if (xhr.readyState == xhr.DONE && xhr.status == 200) {
            const data = JSON.parse(xhr.responseText) as AjaxRes<{ main: Image, list: Image[] }>
            bigImageSrc.val = data.data.main.src
            btnHasStar.val = data.data.main.hasStar
            imageSrcList.forEach((src, index) => {
                src.val = data.data.list[index].src
                imageHasStarList[index].val = data.data.list[index].hasStar
                nowImageIndex.val = index
            })
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
        }
    })
}