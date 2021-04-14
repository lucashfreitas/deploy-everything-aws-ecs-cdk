import * as http from 'http';
import {index} from './controller';

const createServer = () => {
  const server = http.createServer(index);
  server.listen(3000);
  console.log('server listening on port 3000');
};

createServer();
