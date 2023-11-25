export const siteInfo = {
    name: 'IURoc Image'
}

let apiBaseUrl = 'http://127.0.0.1:8080'

export const apiConfig = {
    login: apiBaseUrl + '/api/login',
    logout: apiBaseUrl + '/api/logout',
    register: apiBaseUrl + '/api/register',
    imageList: apiBaseUrl + '/api/imageList',
    imageInfo: apiBaseUrl + '/api/imageInfo'
}