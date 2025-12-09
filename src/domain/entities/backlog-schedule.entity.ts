import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Game } from "./games.entity";

@Entity("backlogSchedule")
export class BacklogSchedule {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    gameId: string;

    @ManyToOne(() => (require("./games.entity") as typeof import("./games.entity")).Game, (game) => game.achievements)
    @JoinColumn({ name: "gameId" })
    game: Game;

    @Column()
    year: number;

    @Column()
    month: number;

    @Column()
    order: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
