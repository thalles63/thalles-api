import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import type { Game } from "./games.entity";

@Entity("genres")
export class Genre {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column()
    slug: string;

    @ManyToMany(() => (require("./games.entity") as typeof import("./games.entity")).Game, (game) => game.genres)
    games: Game[];
}
