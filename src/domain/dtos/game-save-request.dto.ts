import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Max, Min, ValidateNested } from "class-validator";
import { AchievementSaveRequestDto } from "./achievement-save-request.dto"; // Importa a nova classe DTO

export class GameSaveRequestDto {
    @IsOptional()
    @IsUUID()
    id: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AchievementSaveRequestDto)
    achievements: AchievementSaveRequestDto[];

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    @IsString()
    image: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    screenshots: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    banner: string[];

    @IsNumber()
    @Min(0)
    @Max(5.0)
    rating: number;

    @IsOptional()
    @IsInt()
    platform: number;

    @IsOptional()
    @IsInt()
    timePlayed?: number;

    @IsBoolean()
    isPlatinumed: boolean;

    @IsBoolean()
    isCampaignComplete: boolean;

    @IsInt()
    status: number;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    dateCompleted: Date;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    releaseDate: Date;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    lastTimePlayed: Date;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    genres: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    themes: string[];

    @IsOptional()
    @IsString()
    developer: string;

    @IsOptional()
    @IsString()
    publisher: string;

    @IsOptional()
    @IsInt()
    completionistTime: number;

    @IsOptional()
    @IsInt()
    mainExtrasTime: number;

    @IsOptional()
    @IsInt()
    mainStoryTime: number;

    @IsOptional()
    @IsInt()
    itadId: string;
}
