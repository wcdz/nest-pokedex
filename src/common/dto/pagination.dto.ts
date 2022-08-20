import { IsNumber, IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {

    @IsOptional()
    @IsPositive()
    @IsNumber()
    @Min(1)
    public limit?: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    public offset?: number;

}
