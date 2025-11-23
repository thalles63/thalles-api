import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import type { Achievement } from "./achievements.entity";
import type { Genre } from "./genre.entity";
import type { Theme } from "./theme.entity";

@Entity("games")
export class Game {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    image: string;

    @Column({ nullable: true })
    screenshots: string;

    @Column({ nullable: true })
    banner: string;

    @Column({ nullable: true })
    platform: number;

    @Column({ nullable: true })
    releaseDate?: Date;

    @Column({ nullable: true })
    developer: string;

    @Column({ nullable: true })
    publisher: string;

    @Column({ default: 1 })
    status: number;

    @Column({ default: 0 })
    timePlayed: number;

    @Column({ default: false })
    isPlatinumed: boolean;

    @Column({ default: false })
    isCampaignComplete: boolean;

    @Column({ nullable: true })
    dateCompleted: Date;

    @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
    rating: number;

    @Column({ nullable: true })
    lastTimePlayed?: Date;

    @Column({ nullable: true })
    completionistTime?: number;

    @Column({ nullable: true })
    mainExtrasTime?: number;

    @Column({ nullable: true })
    mainStoryTime?: number;

    @OneToMany(() => (require("./achievements.entity") as typeof import("./achievements.entity")).Achievement, (achievement) => achievement.game)
    achievements: Achievement[];

    @ManyToMany(() => (require("./genre.entity") as typeof import("./genre.entity")).Genre, (genre) => genre.games, { cascade: true })
    @JoinTable({
        name: "gamesGenres",
        joinColumn: { name: "gameId", referencedColumnName: "id" },
        inverseJoinColumn: { name: "genreId", referencedColumnName: "id" }
    })
    genres: Genre[];

    @ManyToMany(() => (require("./theme.entity") as typeof import("./theme.entity")).Theme, (theme) => theme.games, { cascade: true })
    @JoinTable({
        name: "gamesThemes",
        joinColumn: { name: "gameId", referencedColumnName: "id" },
        inverseJoinColumn: { name: "themeId", referencedColumnName: "id" }
    })
    themes: Theme[];

    @DeleteDateColumn()
    deletedAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
