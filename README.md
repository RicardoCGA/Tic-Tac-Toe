# Take Home Exercise
Take Home Exercise. You may use whatever language or frameworks you are comfortable in for this challenge. You may also use any open-source, 3rd party libraries or packages you are familiar with to aid your implementation. If you are familiar and comfortable using NodeJS, we have included a Node JS starter project to help get you started. Note - you do not need to use the starter, it is optional and provided only for your convienience.

## Objective
We have a template application for the backend to a [Tic-Tac-Toe](https://en.wikipedia.org/wiki/Tic-tac-toe) game. Also known as "noughts and crosses", or "Xs and Os". Your objective is to implement the "Create New Game" API, "Get Game Status" API, and "Place Token" API, the desired requests and responses for these are outlined below. The "Place Token" API should also calculate if the game is over and if there is a winner. This exercise should take you around 4 hours to complete. Do not over do your implementation, we are not looking for a "final product". We are simply trying to assess your coding abilities. So when you submit your solution, think of it as if you were submitting a PR to be approved by your team.

P.S. If using the NodeJs-starter, feel free to refactor and make whatever changes you want. We have already defined the skeleton, database connection, and entities to help get you started, the controllers and service files have outlines of where your implementation could go. You are welcome to disregard these, or modify them as you see fit.

## If you had more time
Like mentioned above, try to spend no more than 4 hours on this take home. We are curious, if you had more time, what would you do? If you did not have time to implement all the endpoints, how would you go about implementing them?

## APIs

### Create New Game
- Resource: POST `/game/new`
- Request:
  ```json
  {
    "player_1": "",
    "player_2": "",
  }
  ```
- Response
    - 200 - `{"game_id": ""}`.
    - 400 - Request is invalid.

### Get Game Status
- Resource: GET `/game/{gameId}`
- Response
    - 200 - `winner` should only be on the response if game is over. If there was a winner, should be a list with only the player who won. If draw, include both players.
      ```json
      {
        "game_id": "",
        "players": [],
        "outcome": "ACTIVE/GAME_OVER",
        "winner": [],
      }
      ```
    - 400 - If no game exists for gameId

### Place Token
- Resource: POST `/game/{gameId}/placeToken`
- Request
  ```json2
  {
    "player": "",
    "row": "",
    "column": ""
  }
  ```
- Response
    - 200 - Success
    - 400 - Request is invalid or no game exist for gameId.

### Running the project
- Just execute npm install
- Then npm start
