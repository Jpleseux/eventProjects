import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CommitmentsRepositoryTypeOrm } from '@Modules/commitments/infra/repository/commitments.repository.orm';
import { saveCommitmentRequestDto } from './saveCommitment.request.dto';
import { saveCommitmentsUsecase } from '@Modules/commitments/core/usecase/saveCommitments.usecase';

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
  ) {
    const action = new saveCommitmentsUsecase(this.repo);
    const output = await action.execute(body);
    response.status(HttpStatus.OK).send({
      message: 'Evento salvo com sucesso',
      commitment: output.props,
    });
  }
}
