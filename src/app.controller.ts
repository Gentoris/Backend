import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Redirect,
  Render,
  Session,
} from '@nestjs/common';
import { AppService } from './app.service';
import tarhely from './tarhely';
import * as bcrypt from 'bcrypt';
import TarhelyDataDto from './tarhelydata.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  async index(@Session() session: Record<string, any>) {
    let tarhelyName = '';
    if (session.tarhely_id) {
      const [rows]: any = await tarhely.execute(
        'SELECT tarhelyname FROM tarhelyek WHERE id = ?',
        [session.tarhely_id],
      );
      tarhelyName = rows[0].tarhelyname;
    } else {
      tarhelyName = '?';
    }

    return { message: 'Is this the tarhely are you looking for? ' + tarhelyName };
  }

  @Get('/api/tarhelyek')
  async allTarhely() {
    const [tarhelyek] = await tarhely.execute(
      'SELECT id, tarhelyname FROM tarhelyek ORDER BY tarhelyname'
    );
    return { tarhelyek: tarhelyek };
  }

  @Post('/api/register')
  async registerApi(@Body() tarhelydata: TarhelyDataDto) {
    await tarhely.execute('INSERT INTO tarhelyek (name, size, price) VALUES (?, ?, ?)', [
      tarhelydata.tarhelyname,
      await bcrypt.hash(tarhelydata.name),
    ]);
  }

  @Get('/api/tarhelyek/:id')
  async getTarhelyApi(@Param('id') id: number) {
    const [tarhelyek] = await tarhely.execute(
      'SELECT id, tarhelyname FROM tarhelyek WHERE id = ?',
      [id],
    );
    return tarhelyek[0];
  }

  @Delete('/api/tarhelyek/:id')
  async deleteTarhelyApi(@Param('id') id: number) {
    await tarhely.execute(
      'DELETE FROM tarhelyek WHERE id = ?',
      [id],
    );
  }
}
