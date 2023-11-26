import van from 'vanjs-core'

const { div } = van.tags

export const Home = () => {
    return div({ 'data-route': 'home' })
}