import micro, { send } from 'micro';
import { router, get } from 'microrouter';
import SocketIO from 'socket.io';
import jwt from 'jsonwebtoken';

import { NEDB } from './repo/diffMem';
import { JWTAuthService } from './service/auth';
import { SocketIOService } from './service/io';
import * as Usecase from './usecase';

const SECRET = 'secret';

const route = router(
  get('/', (_, res) => {
    send(res, 200, { message: 'server is running' });
  })
);

const app = micro(route);
const io = SocketIO(app);
const inMemDB = new NEDB();
const authService = new JWTAuthService(SECRET);

io.on('connection', socket => {
  const ioService = new SocketIOService(socket, 'diff');

  Usecase.connected(socket.id, inMemDB, authService, ioService);
  Usecase.receiveDiff(
    inMemDB,
    authService,
    ioService,
    () => socket.disconnected
  ).catch(e => {
    console.error(e);
    socket.disconnect();
  });
  socket.on('disconnect', () => Usecase.disConnected(socket.id, inMemDB));
});

app.listen(3000, () => console.log('-- server is listen --'));
