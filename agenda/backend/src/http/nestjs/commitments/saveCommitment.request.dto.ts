import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsDate } from 'class-validator';

export class saveCommitmentRequestDto {
  @ApiProperty({ example: 'Japão' })
  @IsString({ message: 'O lugar do evento deve ser uma string' })
  @IsNotEmpty({ message: 'O lugar do evento não pode ser vazia' })
  eventPlace: string;

  @ApiProperty({ example: 'Evento 1' })
  @IsString({ message: 'O titulo deve ser uma string' })
  @IsNotEmpty({ message: 'O titulo não pode ser vazio' })
  title: string;

  @ApiProperty({ example: '23/04/2023' })
  @IsNotEmpty({ message: 'O data não pode ser vazio' })
  @IsDate({ message: 'A  data deve ser uma data válida' })
  @Transform(({ value }) => new Date(value))
  date: Date;

  @IsString({ message: 'O horario deve ser uma string' })
  @IsNotEmpty({ message: 'O horario não pode ser vazio' })
  time: string;
}
