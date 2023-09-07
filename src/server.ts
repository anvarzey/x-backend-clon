import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import { Router } from './routes/router'
import { DBRepository } from './db/DBRepository'

export class Server {
  private readonly express: express.Express
  private readonly port: string
  private readonly router
  private readonly db

  constructor (port: string, db: DBRepository) {
    this.db = db
    this.express = express()
    this.port = port
    this.router = new Router(this.db)

    dotenv.config()

    this.express.use(express.json())
    this.express.use(cookieParser())
    this.express.use(cors())
    this.express.use('/api', this.router.send())
  }

  public listen (): void {
    this.express.listen(this.port, () => console.log(`Server is running on port ${this.port}`))
  }
}
