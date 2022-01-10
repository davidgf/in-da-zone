import { startController } from 'idz-background'

startController()
  .then(() => console.log('===+= THE CONTROLLER HAS SUCCESSFULLY STARTED'))
  .catch(err => console.error('***++* CONTROLLER FAILED', err))
