import { IsInt, IsPositive, IsString, Min, MinLength } from "class-validator";


export class CreatePokemonDto {

    // isString, MinLength
    @IsString({ message: 'El dato tiene que ser un string' })
    @MinLength(1)
    public name: string;

    // isInt, isPositive, min 1
    @IsInt({ message: 'El dato tiene que ser un entero' })
    @IsPositive({ message: 'El dato tiene que ser positivo' })
    @Min(1)
    public no: number;

}
