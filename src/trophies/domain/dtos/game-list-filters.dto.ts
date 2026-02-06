import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsInt, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { GameSort } from "../sorts/game.sort";

export class GameListFiltersDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @IsEnum(GameSort)
    sort: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    status?: number;

    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt({ each: true })
    platform: number[];

    @IsOptional()
    @IsBoolean()
    isPlatinumed: boolean;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    rating: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    releaseYear: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    completionYear: number;

    @IsOptional()
    @IsString()
    genre: string;

    @IsOptional()
    @IsString()
    theme: string;
}
