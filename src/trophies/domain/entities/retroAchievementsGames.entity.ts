import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("retroAchievementsGames")
export class RetroAchievementsGames {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    platform: number;

    @Column({
        type: "jsonb",
        nullable: false
    })
    games: any;
}
