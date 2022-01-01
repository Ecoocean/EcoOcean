import { bucket } from './firestore';

const FileGlobalOptions = {
  action: 'read',
  expires: '03-17-2025',
};

export async function saveFileToFireStorage(filename, readable) {
  return new Promise((resolve, reject) => {
    const data = [];

    readable.on('data', (chunk) => {
      data.push(chunk);
    });

    readable.on('end', () => {
      const buffer = new Uint8Array(Buffer.concat(data));
      const file = bucket.file(filename);
      file.save(buffer, (error) => {
        if (error) {
          reject(error);
        }
        file.getSignedUrl(FileGlobalOptions).then((results) => {
          const url = results[0];
          resolve(url);
        });
      });
    });
  });
}

export async function saveStringToFireBase(fileName, str) {
  const file = bucket.file(fileName);
  await file.save(str);
  const results = await file.getSignedUrl(FileGlobalOptions);
  const uploadURL = results[0];
  return uploadURL;
}
