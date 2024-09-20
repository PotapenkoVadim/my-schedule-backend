import { Injectable, StreamableFile } from '@nestjs/common';
import { createReadStream, existsSync } from 'fs';

@Injectable()
export class FileSystemsService {
  getStreamableFile(path: string) {
    if (!existsSync(path)) {
      return null;
    }

    const file = createReadStream(path);

    return new StreamableFile(file).getStream();
  }
}
