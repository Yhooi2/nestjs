import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateActorDto } from './dto/create-actor.dto';
import { In, Repository } from 'typeorm';
import { ActorEntity } from './entities/actor.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ActorService {
  constructor(
    @InjectRepository(ActorEntity)
    private readonly actorRepository: Repository<ActorEntity>,
  ) {}
  async create(dto: CreateActorDto): Promise<ActorEntity> {
    const { name } = dto;
    const actor = this.actorRepository.create({ name });
    console.log('Creating actor:', actor);

    return this.actorRepository.save(actor);
  }

  async findByIds(actorsIds: string[]): Promise<ActorEntity[]> {
    const actors = await this.actorRepository.find({
      where: { id: In(actorsIds) },
    });

    if (!actors || actors.length === 0) {
      throw new NotFoundException('Актеры не найдены');
    }

    if (actors.length !== actorsIds.length) {
      throw new NotFoundException(
        `Найдено только ${actors.length} из ${actorsIds.length} актеров`,
      );
    }

    return actors;
  }
}
