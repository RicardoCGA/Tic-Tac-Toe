import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import 'reflect-metadata';

/**
 * Player Entity to represent a player in a tic-tac-toe game in the database.
 *
 * @author TopherThomas
 */
@Entity({name: 'players'})
export default class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
