import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import Koa from 'koa';
import logger from 'koa-logger';
import helmet from 'koa-helmet';
import routing from './routes/';
import { port } from './config';
import winston from 'winston';
import slack from 'node-slack';
require('winston-daily-rotate-file');

// Setup logging
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, { colorize: true, timestamp: true, prettyPrint: true });
var slackAPIKey = process.env.SLACK_HOOK_URL;
var mySlack = new slack(slackAPIKey, {});
// Create Koa Application
const app = new Koa();

app
  .use(logger())
  .use(bodyParser())
  .use(helmet())
  .use(cors());

routing(app);

// Start the application
app.listen(port, () => logToSlack(`Lighthouse API server is running at http://localhost:${port}/`));

export default app;

export function logToSlack (message) {
  winston.log('info', 'SentToSlack: ' + message);
  mySlack.send({
    text      : message,
    channel   : '#lighthouse-status',
    username  : 'Lighthouse',
    icon_emoji: 'lighthouse',
  });
}

export function logErrorToSlack (message) {
  winston.log('error', 'SentToSlack: ' + message);
  mySlack.send({
    text      : message,
    channel   : '#lighthouse-status',
    username  : 'Lighthouse',
    icon_emoji: 'lighthouse',
  });
}
