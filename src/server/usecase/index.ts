import { DiffMem } from '../repo/diffMem';
import { AuthService } from '../service/auth';
import { IO } from '../service/io';
import { Session } from '../types';

export const connected = async (
  id: string,
  mem: DiffMem,
  authService: AuthService,
  ioService: IO
) => {
  console.log('connected: ', id);
  await mem.create({ diffs: [], sessionId: id });
  const token = authService.createToken({
    sessionId: id,
  });
  ioService.sendMsg({ token });
};

export const receiveDiff = async (
  mem: DiffMem,
  authService: AuthService,
  ioService: IO,
  stop: () => boolean
) => {
  while (!stop()) {
    const [data] = await ioService.receiveMsg();

    if (data === null) continue;
    console.log(data);

    if (!authService.validate(data.token)) {
      ioService.sendMsg({ message: 'invalid token' });
      throw new Error('invalid token');
    }

    const { sessionId } = authService.decode(data.token) as Session;
    mem.update(sessionId, data.diff);
  }
};

export const disConnected = async (id: string, mem: DiffMem) => {
  console.log('disconnected: ', id);
  const { diffs } = await mem.get(id);
  console.log(diffs);
  mem.remove(id);
};
