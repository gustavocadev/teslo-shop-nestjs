export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error, acceptFile: boolean) => void
) => {
  console.log({ file });
  if (!file) return callback(new Error('File is empty'), false);

  const fileExtesion = file.mimetype.split('/')[1];
  const validExtesions = ['jpg', 'jpeg', 'png', 'gif'];

  if (!validExtesions.includes(fileExtesion))
    return callback(new Error('File extension is not valid'), false);

  callback(null, true);
};
