import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CommitmentsRepositoryTypeOrm } from '@Modules/commitments/infra/repository/commitments.repository.orm';
import { saveCommitmentRequestDto } from './saveCommitment.request.dto';
import { saveCommitmentsUsecase } from '@Modules/commitments/core/usecase/saveCommitments.usecase';
import { getCommitmentByUserUuid } from '@Modules/commitments/core/usecase/getCommitmentByUserUuid.usecase';
import { deleteCommitments } from '@Modules/commitments/core/usecase/deleteCommitments.usecase';

@ApiTags('Commitment')
@Controller('commitment')
export class CommitmentController {
  constructor(readonly repo: CommitmentsRepositoryTypeOrm) {}
  @ApiOkResponse({
    description: '',
    type: saveCommitmentRequestDto,
    isArray: false,
  })
  @Post('save/commitment')
  async saveCommitment(
    @Body() body: saveCommitmentRequestDto,
    @Res() response,
    @Req() request,
  ) {
    const tokenDecoded = request['tokenPayload'];
    const action = new saveCommitmentsUsecase(this.repo);
    const output = await action.execute({
      date: body.date,
      eventPlace: body.eventPlace,
      time: body.time,
      title: body.title,
      user_id: tokenDecoded.uuid,
    });
    response.status(HttpStatus.OK).send({
      message: 'Evento salvo com sucesso',
      commitment: output.props,
    });
  }
  @Get()
  async getCommitments(@Res() response, @Req() request) {
    const action = new getCommitmentByUserUuid(this.repo);
    const tokenDecoded = request['tokenPayload'];
    const commitments = await action.execute(tokenDecoded.uuid);
    const output = [];
    for (const commitment of commitments) {
      output.push(commitment.props);
    }
    response.status(HttpStatus.OK).send({
      message: '',
      commitments: output,
    });
  }
  @Delete(':uuid')
  async deleteEvent(@Res() response, @Param('uuid') uuid: string) {
    const action = new deleteCommitments(this.repo);
    await action.execute(uuid);
    response.status(HttpStatus.OK).send({
      message: 'Deletado',
    });
  }
}
