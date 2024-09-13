import { Injectable, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';

@Injectable()
export class FileSystemsService {
  getStreamableFile(path: string) {
    const file = createReadStream(path);

    return new StreamableFile(file).getStream();
  }
}
