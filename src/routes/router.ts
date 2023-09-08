import { Router as ExpressRouter, Request, Response } from 'express'
import { GetAllUsersController } from '../controllers/User/GetAllUsersController'
import { DBRepository } from '../db/DBRepository'
import { GetUserController } from '../controllers/User/GetUserController'
import { PatchUserController } from '../controllers/User/PatchUserController'
import { PostSignUpController } from '../controllers/Auth/PostSignUpController'
import { PostLogInController } from '../controllers/Auth/PostLogInController'
import { GetRefreshTokenController } from '../controllers/Auth/GetRefreshTokenController'
import { PostTweetController } from '../controllers/Tweet/PostTweetController'
import { GetTweetsController } from '../controllers/Tweet/GetTweetsController'
import { AuthenticationMiddleware } from '../middlewares/Auth/AuthenticationMiddleware'

export class Router {
  private readonly router
  private readonly db: DBRepository
  private readonly getAllUsersController
  private readonly getUserController
  private readonly patchUserController
  private readonly postSignUpController
  private readonly postLogInController
  private readonly getRefreshTokenController
  private readonly postTweetController
  private readonly getTweetsController
  private readonly authenticationMiddleware

  constructor (db: DBRepository) {
    this.db = db
    this.router = ExpressRouter()
    this.getAllUsersController = new GetAllUsersController(this.db)
    this.getUserController = new GetUserController(this.db)
    this.patchUserController = new PatchUserController(this.db)

    this.postSignUpController = new PostSignUpController(this.db)
    this.postLogInController = new PostLogInController(this.db)
    this.getRefreshTokenController = new GetRefreshTokenController(this.db)

    this.postTweetController = new PostTweetController(this.db)
    this.getTweetsController = new GetTweetsController(this.db)

    this.authenticationMiddleware = new AuthenticationMiddleware()

    this.router.get('/user', async (req: Request, res: Response) => await this.getAllUsersController.run(req, res))
    this.router.get('/user/:id', async (req: Request, res: Response) => await this.getUserController.run(req, res))
    this.router.patch('/user/:id', async (req: Request, res: Response) => await this.patchUserController.run(req, res))

    this.router.post('/auth/signup', async (req: Request, res: Response) => await this.postSignUpController.run(req, res))
    this.router.post('/auth/login', async (req: Request, res: Response) => await this.postLogInController.run(req, res))
    this.router.get('/auth/refresh', async (req: Request, res: Response) => await this.getRefreshTokenController.run(req, res))

    this.router.post('/tweet', this.authenticationMiddleware.run, async (req: Request, res: Response) => await this.postTweetController.run(req, res))
    this.router.get('/tweet', async (req: Request, res: Response) => await this.getTweetsController.run(req, res))
  }

  public send (): typeof this.router {
    return this.router
  }
}
