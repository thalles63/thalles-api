import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Game } from "./games.entity";

@Entity("genres")
export class Genre {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column()
    slug: string;

    @ManyToMany(() => Game, (game) => game.genres)
    games: Game[];
}
