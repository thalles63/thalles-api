import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Game } from "./games.entity";

@Entity("achievements")
export class Achievement {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    platformId: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    type: string;

    @Column({ nullable: true })
    image: string;

    @Column({ default: false })
    isAchieved: boolean;

    @Column({ nullable: true })
    dateAchieved: Date;

    @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
    percentageAchieved: number;

    @Column()
    gameId: string;

    @ManyToOne(() => Game, (game) => game.achievements)
    @JoinColumn({ name: "gameId" })
    game: Game;
}
