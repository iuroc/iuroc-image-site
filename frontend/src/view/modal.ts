import van, { State } from 'vanjs-core'

const { button, div, h5, img } = van.tags

export const ImageView = (src: State<string>) => {
    return div({ class: "modal fade", tabindex: "-1" },
        div({ class: "modal-dialog modal-lg modal-fullscreen-lg-down modal-dialog-scrollable" },
            div({ class: "modal-content" },
                div({ class: "modal-header" },
                    h5({ class: "modal-title" }, "查看图片"),
                    button({ type: "button", class: "btn-close", "data-bs-dismiss": "modal" }),
                ),
                div({ class: "modal-body p-0" },
                    img({ class: 'w-100', src: src })
                ),
                div({ class: "modal-footer" },
                    button({ type: "button", class: "btn btn-warning" }, "收藏图片"),
                ),
            ),
        ),
    )
}
