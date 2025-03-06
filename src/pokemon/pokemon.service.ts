import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {

  private pokemons : Pokemon[] = [];

  private defaultLimit : number;

  constructor(

    //para poder inecjtar un modelo de mongoose
    @InjectModel( Pokemon.name )
    private readonly pokemonModel : Model<Pokemon>,

    private readonly configService : ConfigService
  ){
    this.defaultLimit = this.configService.get<number>('defaultLimit') || 7;
  }


  async create(createPokemonDto: CreatePokemonDto) {
      createPokemonDto.name = createPokemonDto.name.toLowerCase();

      try {
        const pokemon = await this.pokemonModel.create(createPokemonDto);
        return pokemon;
      }
      catch (error) {
        this.handleExceptions(error);
      }   

  }

  findAll( paginationDto : PaginationDto) {

    const {limit = this.defaultLimit, offset = 0} =  paginationDto

    return this.pokemonModel.find()
      .limit( limit )
      .skip ( offset )
      .sort({ no: 1 })
      .select('-__v')
  }

  async findOne(term: string) {

    let pokemon : Pokemon | null = null;

    if(!isNaN(+term)){
      pokemon = await this.pokemonModel.findOne({ no: term });
    }

    //Mongo ID
    if(!pokemon && isValidObjectId(term)){
      pokemon = await this.pokemonModel.findById(term);
    }

    //Name
    if(!pokemon){
      pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase() });
    }


    if(!pokemon) throw new NotFoundException(`Pokemon not found with term ${term}`);


    return pokemon
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    try{
      //usa la funcion propia de findOne
      const pokemon = await this.findOne(term);

      if( updatePokemonDto.name ){
        updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
      }
      await pokemon.updateOne(updatePokemonDto, { new : true });
      return {...pokemon.toJSON(), ...updatePokemonDto};
    }
    catch(error){
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne();

    // const result = await this.pokemonModel.findByIdAndDelete(id);

    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });

    if(deletedCount === 0) throw new BadRequestException(`Pokemon not found with id ${id}`);

    return;
  }
  async deleteAll(){
    await this.pokemonModel.deleteMany({});
  }

  async inserMany(arrayPokemon: CreatePokemonDto[]){
    await this.pokemonModel.insertMany(arrayPokemon);
  }


  private handleExceptions(error: any){
    if(error.code === 11000){
      throw new BadRequestException(`Pokemon Exist id db  ${ JSON.stringify(error.keyValue)}`);
    }
    console.log(error);
    throw new InternalServerErrorException(`Can't update the pokemon - Check
    server logs`);
  }
}
