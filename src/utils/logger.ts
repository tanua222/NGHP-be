import { AppConfig } from './app-config';
import Logger from 'bunyan';

const config = <AppConfig>require('config');

const log: Logger = Logger.createLogger({
  name: 'ivs-svc-log',
  streams: [
    {
      level: config.log.level as Logger.LogLevel,
      stream: process.stdout, // log INFO and above to stdout
    },
    {
      level: 'error',
      stream: process.stdout,
      //path: process.cwd()+ '/logs/ivs-svc-error.log' // log ERROR and above to a file
    },
  ],
});

// ===============================================================================//
// import chalk from 'chalk'
// import { ColorfulChalkLogger, ERROR, Level, DEBUG } from 'colorful-chalk-logger'

// let log = new ColorfulChalkLogger('ivs-svc-log', {
//   level: DEBUG,   // the default value is INFO
//   date: true,    // the default value is false.
//   colorful: true, // the default value is true.
//   inline: true
// }, process.argv)

// log.formatHeader = function (level: Level, date: Date): string {
//   let { desc } = level
//   let { name } = this
//   if( this.flags.colorful ) {
//     desc = level.headerChalk.fg(desc)
//     if (level.headerChalk.bg != null) desc = level.headerChalk.bg(desc)
//     name = chalk.gray(name)
//   }
//   let header = `${desc} ${name}`
//   if( !this.flags.date) return `[${header}]`

//   let dateString = date.toLocaleTimeString()
//   if( this.flags.colorful ) dateString = chalk.gray(dateString)
//   return `<${dateString} ${header}>`
// }

export default log;
