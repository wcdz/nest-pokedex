import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ) { }

  public async findAllPokemons() {
    const result = await this.pokemonModel.find();
    return result;
  }

  public async findOnePokemon(term: string) {

    let pokemon: Pokemon;

    if (!isNaN(Number(term))) pokemon = await this.pokemonModel.findOne({ no: term });

    // MongoID
    if (!pokemon && isValidObjectId(term)) pokemon = await this.pokemonModel.findById(term);

    // Name
    if (!pokemon) pokemon = await this.pokemonModel.findOne({ name: term.toLocaleLowerCase().trim() });

    // Caso no se encuentre con ninguno
    if (!pokemon) throw new NotFoundException(`El pokemon con id, name o no "${term}" no se encontro`);

    return pokemon;
  }

  public async createPokemon(createPokemonDto: CreatePokemonDto) {

    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {

      const pokemon = await this.pokemonModel.create(createPokemonDto); // Se inserta
      return {
        msg: 'Pokemon insertado',
        pokemon
      };

    } catch (error) {
      this.handleExceptions(error);
    }

  }

  public async updatePokemon(
    term: string,
    updatePokemonDto: UpdatePokemonDto
  ) {

    const pokemon = await this.findOnePokemon(term);
    if (updatePokemonDto.name) updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();

    try {
      await pokemon.updateOne(updatePokemonDto, { new: true });

      return {
        ...pokemon.toJSON(),
        ...updatePokemonDto
      };

    } catch (error) {
      this.handleExceptions(error);
    }

  }

  public async removePokemon(id: string) {

    // const pokemon = await this.findOnePokemon(id);
    // await pokemon.deleteOne();
    // const result = await this.pokemonModel.findByIdAndDelete(id);

    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id }); // Elimina y valida si se borro algo o no
    if (deletedCount === 0) throw new BadRequestException(`El pokemon con el id ${id} no fue encontrado/eliminado`);
    return 'Se elimino el pokemon';
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) throw new BadRequestException(`El pokemon ya existe en la base de datos ${JSON.stringify(error.keyValue)}`);
    console.log(error);
    throw new InternalServerErrorException(`No se actualizo el pokemon, verifique los LOGS`);
  }

}
