import { Injectable } from '@nestjs/common';
import { CommitmentsRepositoryTypeOrm } from '@Modules/commitments/infra/repository/commitments.repository.orm';
import * as nodemailer from 'nodemailer';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class EmailNotificationService {
  private readonly transporter;

  constructor(readonly repo: CommitmentsRepositoryTypeOrm) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAILADMIN,
        pass: process.env.EMAILPASSWORD,
      },
    });
  }

  @Cron('0 0 * * *')
  async sendDailyEmailNotifications() {
    const notifications = await this.repo.getAllFromToday();
    for (const notify of notifications) {
      const mailOptions = {
        from: process.env.EMAILADMIN,
        to: notify.email(),
        subject: 'Você tem um evento hoje',
        text: 'Acesse o site para ver seus eventos',
      };
      await this.transporter.sendMail(mailOptions);
    }
  }
}
