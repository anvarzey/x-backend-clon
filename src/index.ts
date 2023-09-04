import { App } from './app'
import { Postgres } from './db/Postgres'

const db = new Postgres()

const app = new App(db)
try {
  app.start().catch(e => new Error(e))
} catch (e) {
  console.error(e)
}
