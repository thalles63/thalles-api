import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("games")
export class Game {
    @PrimaryGeneratedColumn("uuid")
    id: string;

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

    @Column()
    rating: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
