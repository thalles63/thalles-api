import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class SplitExpenseDTO {
    @IsString()
    @IsOptional()
    id?: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    totalValue: number;

    @IsString()
    @IsNotEmpty()
    date: string; // ISO format

    @IsString()
    @IsNotEmpty()
    payerId: string;

    @IsString()
    @IsNotEmpty()
    participantId: string;

    @IsString()
    @IsOptional()
    payerName?: string;

    @IsString()
    @IsOptional()
    participantName?: string;

    @IsString()
    @IsNotEmpty()
    actionCode: string; // e.g. 'SPLIT_50', 'CHARGE_100'

    @IsString()
    @IsOptional()
    categoryId?: string;
}
