import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Achievement } from "./achievements.entity";

@Entity("games")
export class Game {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    igdbId: string;

    @Column()
    platformId: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column()
    image: string;

    @Column({ default: 1 })
    status: number;

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

    @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
    rating: number;

    @Column({ nullable: true })
    lastUnlock: Date;

    @OneToMany(() => Achievement, (achievement) => achievement.game)
    achievements: Achievement[];

    @DeleteDateColumn()
    deletedAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
