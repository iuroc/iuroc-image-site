import van, { State } from 'vanjs-core'
import { addStar } from './home'
const { button, div, h5, img } = van.tags

/** 模态框：图片查看 */
export const ImageView = (image: State<{
    hasStar: boolean
    src: string
}>) => {
    const hasStarState = van.derive(() => image.val.hasStar)
    const starBtnText = van.derive(() => hasStarState.val ? '取消收藏' : '收藏图片')
    const starBtnClass = van.derive(() => `btn ${hasStarState.val ? 'btn-danger' : 'btn-warning'}`)
    return div({ class: 'modal fade', tabindex: '-1' },
        div({ class: 'modal-dialog modal-lg modal-fullscreen-lg-down modal-dialog-scrollable' },
            div({ class: 'modal-content' },
                div({ class: 'modal-header' },
                    h5({ class: 'modal-title' }, '查看图片'),
                    button({ type: 'button', class: 'btn-close', 'data-bs-dismiss': 'modal' }),
                ),
                div({ class: 'modal-body p-0' },
                    div({ class: 'ratio ratio-16x9' },
                        img({ class: 'w-100 h-100', src: () => image.val.src })
                    )
                ),
                div({ class: 'modal-footer' },
                    button({
                        type: 'button', class: starBtnClass, onclick() {
                            addStar(image.val.src).then(hasStar => {
                                hasStarState.val = hasStar
                                image.val.hasStar = hasStar
                            })
                        }
                    }, starBtnText),
                ),
            ),
        ),
    )
}
