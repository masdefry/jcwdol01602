export const validate64Image = (base64Image: string) => {
  const matches = base64Image.match(/^data:(image\/(jpeg|jpg|png));base64,/);
  if (!matches) {
    return {
      valid: false,
      message: 'Invalid image format. Only JPEG, JPG, PNG allowed.',
    };
  }
  const base64Data = base64Image.replace(
    /^data:image\/(jpeg|jpg|png);base64,/,
    '',
  );
  const imageBuffer = Buffer.from(base64Data, 'base64');
  if (imageBuffer.length > 1 * 1024 * 1024) {
    return { valid: false, message: 'Image size exceeds 1MB limit.' };
  }
  return { valid: true, message: 'Valid image' };
};
