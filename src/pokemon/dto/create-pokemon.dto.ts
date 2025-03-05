import { IsInt, IsPositive, Min, MinLength } from "class-validator";

export class CreatePokemonDto {

    @IsPositive()
    @IsInt()
    @Min(1)
    no: number;


    @MinLength(1)
    name: string;

}
