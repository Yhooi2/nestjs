import { ReviewEntity } from 'src/review/entities/review.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Ganre {
  ACTION = 'action',
  COMEDY = 'comedy',
  DRAMA = 'drama',
  HORROR = 'horror',
  ROMANCE = 'romance',
  SCIFI = 'sci-fi',
  THRILLER = 'thriller',
  default = 'unknown',
}

@Entity({ name: 'movies' })
export class MovieEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 128,
  })
  title: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({
    type: 'enum',
    enum: Ganre,
    default: Ganre.default,
  })
  ganre: Ganre;

  @Column({
    type: 'decimal',
    precision: 3,
    scale: 1,
    default: 0.0,
  })
  rating: number;

  @Column({ name: 'is_available', type: 'boolean', default: false })
  isAvailable: boolean;

  @Column({
    name: 'release_year',
    type: 'int',
    unsigned: true,
  })
  releaseYear: number;

  @Column({
    name: 'release_date',
    type: 'date',
    nullable: true,
  })
  releaseDate: string;

  @OneToMany(() => ReviewEntity, (review) => review.movie)
  reviews: ReviewEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
