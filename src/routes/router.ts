import { Router as ExpressRouter, Request, Response } from 'express'
import { GetAllUsersController } from '../controllers/GetAllUsersController'
import { PostUserController } from '../controllers/PostUserController'
import { DBRepository } from '../db/DBRepository'

export class Router {
  private readonly router
  private readonly getAllUsersController
  private readonly postUserController
  private readonly db: DBRepository

  constructor (db: DBRepository) {
    this.db = db
    this.router = ExpressRouter()
    this.getAllUsersController = new GetAllUsersController(this.db)
    this.postUserController = new PostUserController(this.db)

    this.router.get('/user', async (req: Request, res: Response) => await this.getAllUsersController.run(req, res))
    this.router.post('/user', async (req: Request, res: Response) => await this.postUserController.run(req, res))
  }

  public send (): typeof this.router {
    return this.router
  }
}
