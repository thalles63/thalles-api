import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import type { Game } from "./games.entity";

@Entity("franchises")
export class Franchise {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @OneToMany(() => (require("./games.entity") as typeof import("./games.entity")).Game, (game) => game.franchise)
    games: Game[];
}
