import van, { State } from 'vanjs-core'
import { apiConfig } from '../config'
import { AjaxRes } from '../util'
import { RouteEvent } from 'apee-router'

const { div, img } = van.tags
const { svg, path } = van.tagsNS('http://www.w3.org/2000/svg')

interface Image {
    index: number
    src: string
}
const imageList = van.state([]) as State<Image[]>

export const star: RouteEvent = route => {
    if (route.status == 1) return
    loadStarList()
    return route.status = 1
}

export const Star = () => {
    return div({ 'data-route': 'star' },
        () => div({ class: 'row' },
            imageList.val.map(image => {
                return ImageBox(image.src)
            })
        )
    )
}

const ImageBox = (src: string) => {
    return div({ class: 'col-xl-3 col-lg-4 col-6 mb-4' },
        div({ class: 'position-relative starRouteImage' },
            img({ src, class: 'w-100 rounded-4' }),
            starIcon()
        )
    )
}

const xhrStarList = new XMLHttpRequest()
const loadStarList = () => {
    const xhr = xhrStarList
    xhr.abort()
    xhr.open('GET', apiConfig.starList)
    xhr.send()
    xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState == xhr.DONE && xhr.status == 200) {
            const data = JSON.parse(xhr.responseText) as AjaxRes<Satr[]>
            if (data.code == 200) {
                imageList.val = data.data.map((star, index) => {
                    return { index, src: star.imageSrc }
                })
                return
            }
            alert(data.message)
            location.hash = ''
        }
    })
}

interface Satr {
    id: number
    username: string
    imageSrc: string
    createTime: string
}

export const starIcon = () => div({ class: 'position-absolute', role: 'button', style: 'bottom: 10px; right: 10px;' },
    svg({ width: "16", height: "16", fill: "#ffc107", class: "bi bi-star-fill", viewBox: "0 0 16 16" },
        path({ "d": "M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" }),
    )
)
