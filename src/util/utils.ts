import {Request} from 'express';
import {PlayerDTO} from "../dtos/player.dto";
import * as crypto from "crypto";

export default class Util {

    static resolvePlayer = ( req:Request, playerId:number ) => {
        const players:Array<PlayerDTO> = req.app.settings.playersStore;
        if (players.find(player => player.player_id === playerId)) {
            return players.find(player => player.player_id === playerId);
        } else {
            players.push({player_id: players.length + 1, name: crypto.randomBytes(4).toString('hex')});
            console.log(players[players.length-1]);
            req.app.set("playersStore", players);
            return players[players.length-1];
        }
    }

    static initPlayers = ( ) =>{
        const playerStore:Array<PlayerDTO> = [];

        playerStore.push({ player_id: 1, name: 'John' });
        playerStore.push({ player_id: 2, name: 'Peter' });
        playerStore.push({ player_id: 3, name: 'Rick' });
        playerStore.push({ player_id: 7, name: 'Spencer' });
        playerStore.push({ player_id: 4, name: 'Clark' });
        playerStore.push({ player_id: 8, name: 'Colin' });
        playerStore.push({ player_id: 5, name: 'Bruno' });
        playerStore.push({ player_id: 9, name: 'Kory' });
        playerStore.push({  player_id: 6, name: 'Joseph' });
        playerStore.push({ player_id: 10, name: 'Cesar' });

        return playerStore;

    }

}

