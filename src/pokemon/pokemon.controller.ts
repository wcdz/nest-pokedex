import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';

@Controller('pokemon')
export class PokemonController {

  constructor(
    private readonly pokemonService: PokemonService
  ) { }

  @Get()
  public findAll() {
    return this.pokemonService.findAllPokemons();
  }

  @Get(':term')
  public findOne(@Param('term') term: string) {
    return this.pokemonService.findOnePokemon(term);
  }

  @Post()
  @HttpCode(HttpStatus.OK) // 200
  public create(@Body() createPokemonDto: CreatePokemonDto) {
    return this.pokemonService.createPokemon(createPokemonDto);
  }

  @Patch(':term')
  public update(
    @Param('term') term: string,
    @Body() updatePokemonDto: UpdatePokemonDto
  ) {
    return this.pokemonService.updatePokemon(term, updatePokemonDto);
  }

  @Delete(':id') // Pipe personalizado
  public remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.pokemonService.removePokemon(id);
  }

}
