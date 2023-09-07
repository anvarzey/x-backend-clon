import { Request, Response } from 'express'
import { DBRepository } from '../../db/DBRepository'
import { Controller } from '../Controller'

export class PostTweetController implements Controller {
  private readonly db: DBRepository

  constructor (db: DBRepository) {
    this.db = db
  }

  async run (req: Request, res: Response): Promise<void> {
    const { tweetContent, authorId, commentId } = req.body

    if (!tweetContent || !authorId) {
      res.status(400).end()
      return
    }

    try {
      await this.db.createTweet({ tweetContent, authorId, commentId })

      res.status(200).end()
    } catch (e) {
      console.error(e)
      res.status(500).end()
    }
  }
}
