import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Game } from "./games.entity";

@Entity("achievements")
export class Achievements {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    image: string;

    @Column({ nullable: true })
    classification: number;

    @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
    percentageAchieved: number;

    @ManyToOne(() => Game, (game) => game.achievements)
    @JoinColumn({ name: "gameId" })
    game: Game;
}
