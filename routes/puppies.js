import { Router } from 'express'
import * as puppiesCtrl from '../controllers/puppies.js'
import { decodeUserFromToken, checkAuth } from '../middleware/auth.js'

const router = Router()

/*---------- Public Routes ----------*/
router.get('/', puppiesCtrl.index)

/*---------- Protected Routes ----------*/
router.use(decodeUserFromToken)
router.post('/', checkAuth, puppiesCtrl.create)
router.delete('/:id', checkAuth, puppiesCtrl.delete)
router.put('/:id', checkAuth, puppiesCtrl.update)
router.put('/:id/add-photo', checkAuth, puppiesCtrl.addPhoto)

export { router }
