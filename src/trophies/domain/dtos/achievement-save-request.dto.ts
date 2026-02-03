import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Max, Min } from "class-validator";

export class AchievementSaveRequestDto {
    @IsOptional()
    @IsUUID()
    id?: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    description_ptbr?: string;

    @IsOptional()
    @IsString()
    type?: string;

    @IsOptional()
    @IsString()
    image: string;

    @IsBoolean()
    isAchieved: boolean;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    dateAchieved?: Date;

    @IsNumber()
    @Min(0)
    @Max(100)
    percentageAchieved: number;

    @IsOptional()
    @IsString()
    platformId?: string;

    @IsUUID()
    gameId: string;
}
