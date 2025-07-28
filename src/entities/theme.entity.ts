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

    @ManyToMany(() => Game, (game) => game.themes)
    games: Game[];
}
