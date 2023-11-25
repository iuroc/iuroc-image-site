/// <reference types="vite/client"/>
import 'bootstrap/dist/css/bootstrap.css'
import van from 'vanjs-core'
import { Router } from 'apee-router'
import { afterRouter } from './afterRouter'
import { App } from './tag/app'

van.add(document.body, App())

const router = new Router()
router.set(['home', 'star', 'about', 'login'])
router.start()

afterRouter(router)
