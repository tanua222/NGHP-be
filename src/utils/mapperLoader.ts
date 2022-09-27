import fs from 'fs';
import mybatisMapper from 'mybatis-mapper';
import log from './logger';

export default class MapperLoader {
  private static loadMappers(path: string = '') {
    let files = fs.readdirSync(`./src${path}/mappers`);
    let mappers = files.map(function (file: string) {
      let filepath = `./src${path}/mappers/${file}`;
      // log.debug(`loading mapper: ${filepath}`)
      return filepath;
    });
    mybatisMapper.createMapper(mappers);
    log.debug(`IVS mappers initialized: ${path}`);
  }

  static load() {
    MapperLoader.loadMappers();
  }
}
