import {Request, Response} from 'express';
import {BadRequest} from 'http-errors';
import {NewGameDTO} from '../dtos/newgame.dto';
import {PlaceTokenDTO} from "../dtos/placetoken.dto";
import GameService from "../services/game.service";

/**
 * Game Controller
 * Handles web requests and responses.
 *
 * @author TopherThomas
 */
export default class GameController {

  /**
   * Get Game Status
   *
   * - 200: {GameStatusDTO}
   * - 400: If consumer passed a bad request.
   * - 500: Internal error occured.
   *
   * @param {Request} req http request
   * @param {Response} res http response
   */
  static async gameStatus(req: Request, res: Response ) {

    const {gameId} = req.params;
    await GameService.gameStatus(Number.parseInt(gameId), req).then(  result => {
          if ( result.game_id > 0 ){
            res.status(200).send(result);
          }else if(result.game_id === -1) {
            res.status(200).send({message: 'Game is still active'});
          }else{
            GameController.handleError(new BadRequest('No game exists for gameId'), res);
          }
    });

  }

  /**
   * Create a new game.
   *
   * - 200: {GameIdDTO}
   * - 400: If consumer passed a bad request.
   * - 500: Internal error occured.
   *
   * @param {Request} req http request
   * @param {Response} res http response
   */
  static async newGame(req: Request, res: Response) {

    const newGame:NewGameDTO = req.body;

    const keys = Object.keys(newGame);
    if ( keys.find(element => element === 'player_1') && keys.find(element => element === 'player_2') ){
      await GameService.newGame(newGame.player_1,newGame.player_2, req).then( gameId => {
            res.status(200).send({gameId});
      });
    }else{
      GameController.handleError(new BadRequest('Request is invalid'), res);
    }

  }

  /**
   * Place token for a game.
   *
   * - 200: Id succesful.
   * - 400: If consumer passed a bad request.
   * - 500: Internal error occured.
   *
   * @param {Request} req http request
   * @param {Response} res http response
   */
  static async placeToken(req: Request, res: Response) {

    const {gameId} = req.params;
    const placeTokenObj:PlaceTokenDTO = req.body
    const keys = Object.keys(placeTokenObj);

    if ( keys.find(element => element === 'player') && keys.find(element => element === 'row') && keys.find(element => element === 'column') ){

      await GameService.placeToken(Number.parseInt(gameId),placeTokenObj.player,placeTokenObj.row,placeTokenObj.column,req).then(result => {
        if (result.game_id > 0) {
          res.status(200).send(result);
        }else if ( result.game_id === 0){
          res.status(200).send({});
        }else{
          GameController.handleError(new BadRequest('No game exist for provided gameId'),res);
        }
      })

    }else{
      GameController.handleError(new BadRequest('Request is invalid'), res);
    }

  }

  /**
   * Handle errors thrown from the service.
   *
   * @param {unknown} e error.
   * @param {Response} res http response
   */
  static handleError(e: unknown, res: Response) {
    console.log('Error Occured', e);
    if (e instanceof BadRequest) {
      // If bad request, we will let the user know what they did wrong.
      res.status(400);
      res.send(e.message);
    } else {
      // All internal errors will give a generic message.
      // This way we do no give away impementation details or
      // allow the user to know what went wrong.
      res.status(500);
      res.send('Internal Error Occured.');
    }
  }


}
