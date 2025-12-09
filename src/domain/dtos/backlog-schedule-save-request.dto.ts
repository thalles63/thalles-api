import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class BacklogScheduleSaveRequestDto {
    @IsOptional()
    @IsUUID()
    id: string;

    @IsNotEmpty()
    @IsNumber()
    year: number;

    @IsNotEmpty()
    @IsNumber()
    month: number;

    @IsNotEmpty()
    @IsString()
    gameId: string;

    @IsNotEmpty()
    @IsNumber()
    order: number;
}
