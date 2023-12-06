import van, { State } from 'vanjs-core'
import { apiConfig } from '../config'
import { AjaxRes } from '../util'
import { starIcon } from './star'
import { RouteEvent } from 'apee-router'
import { imageViewModal, imageViewSrc } from './app'

const { button, div, img, span } = van.tags

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

/** 是否将“再来一组”按钮设置为禁用 */
const disabledImageList = van.state(false)
const listEle = div({ class: 'row' })
const loadMoreShow = van.state(false)
export const home: RouteEvent = route => {
    if (route.status == 1) return
    loadRandomImageList(disabledImageList)
    loadOneWord()
    loadImageList(listEle)
    return route.status = 1
}

const ListImageBox = (src: string) => {
    return div({ class: 'col-xl-3 col-lg-4 col-6 mb-4' },
        div({ class: 'ratio ratio-16x9', onclick() {
            imageViewSrc.val = src
            imageViewModal.show()
        } },
            img({ src, class: 'w-100 h-100 rounded-4', role: 'button' })
        ),
    )
}

export const Home = () => {
    return div({ 'data-route': 'home' },
        div({ class: 'row position-relative mb-4' },
            div({ class: 'col-lg-8 mb-4 mb-lg-0' }, ImageBox(bigImageSrc)),
            div({ class: 'col-lg-4' }, RightPanel()),
        ),
        listEle,
        LoadMoreBtn()
    )
}

const LoadMoreBtn = () => {
    const loading = van.state(false)
    const spinner = van.derive(() => loading.val ? span({ class: 'spinner-border spinner-border-sm me-1' }) : '')
    return div({ class: 'text-center' },
        button({
            class: () => `btn btn-success ${loadMoreShow.val ? '' : 'd-none'}`,
            onclick() { loadImageList(listEle, loading) },
            disabled: loading
        }, () => spinner.val, '加载更多')
    )
}

const loadImageList = (listEle: HTMLDivElement, loading?: State<boolean>) => {
    if (loading) loading.val = true
    getImageList(36).then(data => {
        const handle = () => {
            const { list } = data
            list.forEach(item => {
                van.add(listEle, ListImageBox(item.src))
            })
            loadMoreShow.val = true
        }
        if (loading) {
            setTimeout(() => {
                handle()
                loading.val = false
                loadMoreShow.val = true
            }, 500)
        } else handle()
    })
}

const getImageList = (count: number = 6) => {
    interface AjaxImage {
        src: string
        hasStar: boolean
    }
    type AjaxData = { main: AjaxImage, list: AjaxImage[] }
    return new Promise<AjaxData>(resolve => {
        const xhr = new XMLHttpRequest()
        xhr.open('GET', apiConfig.randomImage + '?count=' + count)
        xhr.send()
        xhr.addEventListener('readystatechange', () => {
            if (xhr.readyState == xhr.DONE && xhr.status == 200) {
                const data = JSON.parse(xhr.responseText) as AjaxRes<AjaxData>
                resolve(data.data)
            }
        })
    })
}

const RightPanel = () => {
    const SmallImage = (image: Image) => {
        return div({ class: 'mb-3 mb-xxl-4 col-6 col-sm-4 col-lg-6' },
            div({ class: 'position-relative' },
                div({ class: 'ratio ratio-16x9' },
                    img({
                        class: 'w-100 h-100 rounded-3', role: 'button', src: image.src, onclick() {
                            nowImageIndex.val = image.index
                        }
                    }),
                ),
                () => image.hasStar.val ? starIcon() : ''
            )
        )
    }
    return div(
        div({ class: 'row mb-3 mb-xxl-4' },
            ReloadList(),
            AddStar(),
        ),
        () => div({ class: 'row' },
            imageList.val.map(image => SmallImage(image))
        ),
        div({ class: 'text-muted text-truncate' }, oneWord)
    )
}

/** 按钮：再来一组 */
const ReloadList = () => {
    const loading = () => disabledImageList.val ? span({ class: 'spinner-border spinner-border-sm me-1' }) : ''
    const onclick = () => {
        disabledImageList.val = true
        loadRandomImageList(disabledImageList)
        loadOneWord()
    }
    return div({ class: 'col col-md-6' },
        button({
            class: 'btn btn-success w-100', disabled: disabledImageList, onclick
        }, loading, '再来一组')
    )
}

/** 按钮：新增收藏 */
const AddStar = () => {
    const starBtnText = van.derive(() => btnHasStar.val ? '取消收藏' : '收藏图片')
    const starBtnClass = van.derive(() => btnHasStar.val ? 'btn-outline-danger' : 'btn-warning')
    const loading = van.state(false)
    const spinner = van.derive(() => loading.val ? span({ class: 'spinner-border spinner-border-sm me-1' }) : '')
    return div({ class: 'col col-md-6' },
        button({
            class: () => `btn w-100 ${starBtnClass.val}`,
            onclick() {
                clickAddStar(loading)
            },
            disabled: loading
        }, () => spinner.val, starBtnText),
    )
}

const ImageBox = (src: State<string>) => {
    return img({ class: 'w-100 rounded-4', src })
}


const loadRandomImageList = (disable: State<boolean>) => {
    getImageList(6).then(data => {
        bigImageSrc.val = data.main.src
        btnHasStar.val = data.main.hasStar
        imageList.val = data.list.map((item, index) => {
            return {
                hasStar: van.state(item.hasStar),
                index,
                src: van.state(item.src)
            }
        })
        nowImageIndex.val = 0
        setTimeout(() => {
            disable.val = false
        }, 500)
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
const clickAddStar = (loading: State<boolean>) => {
    loading.val = true
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
            setTimeout(() => {
                const data = JSON.parse(xhr.responseText) as AjaxRes<{ hasStar: boolean }>
                let { hasStar } = data.data
                imageList.val[nowImageIndex.val].hasStar.val = hasStar
                loading.val = false
            }, 500)
        }
    })
}