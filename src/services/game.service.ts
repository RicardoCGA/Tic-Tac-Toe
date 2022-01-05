import {GameStatusDTO, Outcome} from '../dtos/gamestatus.dto';
import {GameIdDTO} from '../dtos/gameid.dto';
import Util from "../util/utils";
import {Request} from "express";
import {NewGameDTO} from "../dtos/newgame.dto";

/**
 * Game Service
 * Business Logic for handling games.
 *
 * @author TopherThomas
 */
export default class GameService {
  static async gameStatus(gameId: number, req:Request): Promise<GameStatusDTO>  {

    const gamesStore: Array<GameStatusDTO> = req.app.settings.gameStore;

    let gameStatus:GameStatusDTO = {game_id:-1,players:[],outcome:Outcome.ACTIVE};

    if (gamesStore.find(element => gameId === element.game_id)) {
      if (gamesStore[gameId - 1].outcome === Outcome.GAME_OVER) {
        return gamesStore[gameId - 1];
      } else {
        return gameStatus;
      }
    }else{
      gameStatus = {...gameStatus,game_id:-2}
      return gameStatus;
    }
  }

  static async newGame(
    playerOneId: number,
    playerTwoId: number,
    req: Request
  ): Promise<GameIdDTO> {

    const gamesStore = req.app.settings.gameStore;
    const gameId:GameIdDTO = { game_id: gamesStore.length+1 };
    const gamesBoars = req.app.settings.gamesBoards;
    const newGame:NewGameDTO = req.body;

    gamesStore.push({
      game_id: gameId.game_id,
      players: [Util.resolvePlayer(req,newGame.player_1),Util.resolvePlayer(req,newGame.player_2)],
      outcome: Outcome.ACTIVE});
    gamesBoars.push([ -1,-1,-1,-1,-1,-1,-1,-1,-1 ]);
    req.app.set("gameStore", gamesStore);
    req.app.set("gamesBoards",gamesBoars);

    return gameId;

  }

  static async placeToken(
    gameId: number,
    playerId: number,
    row: number,
    col: number,
    req: Request
  ) : Promise<GameStatusDTO> {

    const gamesStore:Array<GameStatusDTO> = req.app.settings.gameStore;
    const gamesBoards:Array<Array<number>> = req.app.settings.gamesBoards;
    let gameStatusDTO:GameStatusDTO = {game_id:0,players:[],outcome:Outcome.ACTIVE}

    if (gamesStore.find((element,index) => gameId === element.game_id)){
      const {player, row, column } = req.body;
      gamesBoards[gameId-1] = GameService.validateMove( player, column, row, gamesBoards[gameId-1] );
      req.app.set("gamesBoards",gamesBoards);
      const result = GameService.validateGameStatus( player, gamesBoards[gameId-1] );
      if (result.outcome === Outcome.GAME_OVER && result.winner ){
        const updatedGameStatus:GameStatusDTO = {
          "game_id": gameId,
          "players": gamesStore[gameId-1].players,
          "outcome": result.outcome,
          "winner": [player]
        };
        gamesStore[gameId-1] = updatedGameStatus;
        req.app.set("gamesStore", gamesStore);
        return updatedGameStatus;
      }else if ( result.outcome === Outcome.GAME_OVER ) {
        const updatedGameStatus:GameStatusDTO = {
          "game_id": gameId,
          "players": gamesStore[gameId-1].players,
          "outcome": result.outcome,
          "winner": gamesStore[gameId-1].players.map(player=>player.player_id?player.player_id:-1)
        };
        gamesStore[gameId-1] = updatedGameStatus;
        req.app.set("gamesStore", gamesStore);
        return updatedGameStatus;
      }else{
        return gameStatusDTO;
      }

    }else{
      return {...gameStatusDTO, game_id: -1}
    }
  }


  /**
   * Validates if selected coordinates are valid
   *
   * returns updated gameBoard
   *
   * @param player player_id
   * @param column coordinate
   * @param row    coordinate
   * @param gameBoard game positions
   */
  static validateMove( player:number, column:number, row: number, gameBoard:Array<number>){
    const index = GameService.translateCoordinate(column,row);
    if ( index !== -1 ){
      if ( gameBoard[index] === -1 ){
        gameBoard[index] = player;
      }
    }

    return gameBoard;
  }

  /**
   * Converts bidimensional coordinates into one-dimension
   *
   * @param column
   * @param row
   */
  static translateCoordinate( column:number, row: number ) {

    if ( row === 0 && column === 0){
      return 0;
    }
    if ( row === 0 && column === 1){
      return 1;
    }
    if ( row === 0 && column === 2){
      return 2;
    }
    if ( row === 1 && column === 0){
      return 3;
    }
    if ( row === 1 && column === 1){
      return 4;
    }
    if ( row === 1 && column === 2){
      return 5;
    }
    if ( row === 2 && column === 0){
      return 6;
    }
    if ( row === 2 && column === 1){
      return 7;
    }
    if ( row === 2 && column === 2){
      return 8;
    }
    return -1;
  }

  /**
   * Validates game status ( win conditions / draw condition / default continue
   *
   * @param player
   * @param gameBoard
   */
  static validateGameStatus(player:number, gameBoard:Array<number>){
    if ( gameBoard[0] === player && gameBoard[1] === player && gameBoard[2] === player ||
        gameBoard[3] === player && gameBoard[4] === player && gameBoard[5] === player ||
        gameBoard[6] === player && gameBoard[7] === player && gameBoard[8] === player ||
        gameBoard[0] === player && gameBoard[3] === player && gameBoard[6] === player ||
        gameBoard[1] === player && gameBoard[4] === player && gameBoard[7] === player ||
        gameBoard[2] === player && gameBoard[5] === player && gameBoard[8] === player ||
        gameBoard[0] === player && gameBoard[4] === player && gameBoard[8] === player ||
        gameBoard[2] === player && gameBoard[4] === player && gameBoard[6] === player){

      return {
        "outcome": Outcome.GAME_OVER,
        "winner": [player],
      }

    }else if ( gameBoard[0] !== -1 && gameBoard[1] !== -1 && gameBoard[2] !== -1 &&
        gameBoard[3] !== -1 && gameBoard[4] !== -1 && gameBoard[5] !== -1 &&
        gameBoard[6] !== -1 && gameBoard[7] !== -1 && gameBoard[8] !== -1  ){
      return {
        "outcome": Outcome.GAME_OVER
      }
    }else {
      return {
        "outcome": Outcome.ACTIVE
      }
    }
  }

}
