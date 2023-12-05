/// <reference types="vite/client"/>
import 'bootstrap/dist/css/bootstrap.css'
import van from 'vanjs-core'
import { Router } from 'apee-router'
import { afterRouter } from './afterRouter'
import { App } from './view/app'
import { checkLogin } from './view/login'
import '../css/main.css'
import { home } from './view/home'
import { star } from './view/star'

van.add(document.body, App())
checkLogin()
const router = new Router()
router.set(['home', 'star', 'about', 'login'])
router.set('home', home)
router.set('star', star)
router.start()
afterRouter(router)
