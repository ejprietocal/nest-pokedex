import { Inject, Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {


  constructor(
    @Inject()
    private readonly PokemonService: PokemonService,
    private readonly http : AxiosAdapter,
  ){}



  async executeSeed(){

    await this.PokemonService.deleteAll();

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');

    const pokemonToinsert  : { name: string, no:number }[] = [];
    data.results.forEach(({name, url}) =>{
      const segments =  url.split('/');
      const no = +segments[segments.length - 2];

      // const pokemon = await this.PokemonService.create({no, name});

      pokemonToinsert.push({no, name}) 

    })

    await this.PokemonService.inserMany(pokemonToinsert);


    return `seeed executed`;
  }
}
