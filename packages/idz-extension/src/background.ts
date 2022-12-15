import { startController } from 'idz-background'

startController()
  .then(() => console.log('[BACKGROUND] ==== THE CONTROLLER HAS SUCCESSFULLY STARTED'))
  .catch(err => console.error('[BACKGROUND] ***++* CONTROLLER FAILED', err))
