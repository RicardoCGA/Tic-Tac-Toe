import express, {Request, Response} from 'express';
import GameRoute from './game.route';

/**
 * Application Routes
 *
 * @author TopherThomas
 */

const router = express.Router();

/* GET home page. */
router.get('/', (req: Request, res: Response) => {
  res.send({title: 'Hello World! 👋'});
});

/* Set game routes. */
router.use('/game', GameRoute)


// Export router.
module.exports = router;
