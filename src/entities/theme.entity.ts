import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Game } from "./games.entity";

@Entity("themes")
export class Theme {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column()
    slug: string;

    @ManyToMany(() => (require("./games.entity") as typeof import("./games.entity")).Game, (game) => game.genres)
    games: Game[];
}
