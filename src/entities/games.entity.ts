import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Achievements } from "./achievements.entity";

@Entity("games")
export class Game {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ default: "" })
    externalGameId: string;

    @Column()
    name: string;

    @Column()
    image: string;

    @Column()
    platform: number;

    @Column({ default: 0 })
    timePlayed: number;

    @Column({ default: false })
    isPlatinumed: boolean;

    @Column({ nullable: true })
    dateCompleted: Date;

    @Column({ default: false })
    isCampaignComplete: boolean;

    @Column({ nullable: true })
    screenshot: string;

    @Column()
    rating: number;

    @OneToMany(() => Achievements, (achievement) => achievement.game)
    achievements: Achievements[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
