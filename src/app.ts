import { DBRepository } from './db/DBRepository'
import { Server } from './server'

export class App {
  private server?: Server
  db: DBRepository

  constructor (db: DBRepository) {
    this.db = db
  }

  public async start (): Promise<void> {
    const port = process.env.PORT ?? '4001'
    this.server = new Server(port, this.db)

    return this.server.listen()
  }
}
