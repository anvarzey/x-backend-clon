import { Router as ExpressRouter, Request, Response } from 'express'
import { GetAllUsersController } from '../controllers/User/GetAllUsersController'
import { DBRepository } from '../db/DBRepository'
import { GetUserController } from '../controllers/User/GetUserController'
import { PatchUserController } from '../controllers/User/PatchUserController'
import { PostSignUpController } from '../controllers/Auth/PostSignUpController'
import { PostLogInController } from '../controllers/Auth/PostLogInController'
import { PostRefreshTokenController } from '../controllers/Auth/PostRefreshTokenController'

export class Router {
  private readonly router
  private readonly db: DBRepository
  private readonly getAllUsersController
  private readonly getUserController
  private readonly patchUserController
  private readonly postSignUpController
  private readonly postLogInController
  private readonly postRefreshTokenController

  constructor (db: DBRepository) {
    this.db = db
    this.router = ExpressRouter()
    this.getAllUsersController = new GetAllUsersController(this.db)
    this.getUserController = new GetUserController(this.db)
    this.patchUserController = new PatchUserController(this.db)

    this.postSignUpController = new PostSignUpController(this.db)
    this.postLogInController = new PostLogInController(this.db)
    this.postRefreshTokenController = new PostRefreshTokenController()

    this.router.get('/user', async (req: Request, res: Response) => await this.getAllUsersController.run(req, res))
    this.router.get('/user/:id', async (req: Request, res: Response) => await this.getUserController.run(req, res))
    this.router.patch('/user/:id', async (req: Request, res: Response) => await this.patchUserController.run(req, res))

    this.router.post('/auth/signup', async (req: Request, res: Response) => await this.postSignUpController.run(req, res))
    this.router.post('/auth/login', async (req: Request, res: Response) => await this.postLogInController.run(req, res))
    this.router.post('/auth/refresh', async (req: Request, res: Response) => await this.postRefreshTokenController.run(req, res))
  }

  public send (): typeof this.router {
    return this.router
  }
}
