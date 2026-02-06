import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { StatusEnum } from "../enums/status.enum";
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
    description_ptbr: string;

    @Column({ nullable: true })
    image: string;

    @Column({ nullable: true })
    screenshots: string;

    @Column({ default: 1 })
    homeCoverType: number;

    @Column({ nullable: true })
    imageSteam: string;

    @Column({ nullable: true })
    imageRawg: string;

    @Column({ nullable: true })
    platform: number;

    @Column({ nullable: true })
    releaseDate?: Date;

    @Column({ nullable: true })
    developer: string;

    @Column({ nullable: true })
    publisher: string;

    @Column({ default: StatusEnum.Wishlist })
    status: number;

    @Column({ default: 0 })
    timePlayed: number;

    @Column({ default: false })
    isPlatinumed: boolean;

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

    @Column({ nullable: true })
    itadId: string;

    @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
    currentPrice: number;

    @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
    regularPrice: number;

    @Column({ nullable: true })
    priceExpiry?: Date;

    @Column({ default: false })
    isPriceAllTimeLow: boolean;

    @Column({ default: false })
    isPriceOneYearTimeLow: boolean;

    @Column({ nullable: true })
    urlToBuy: string;

    @Column({ nullable: true })
    comments: string;

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

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
