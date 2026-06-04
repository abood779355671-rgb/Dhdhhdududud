import QRCode from 'qrcode';

export async function generateQRDataURL(
  value: string,
  options?: { size?: number; dark?: string; light?: string; margin?: number }
): Promise<string> {
  return await QRCode.toDataURL(value, {
    width: options?.size || 300,
    margin: options?.margin ?? 2,
    color: {
      dark: options?.dark || '#0A0E20',
      light: options?.light || '#FFFFFF'
    },
    errorCorrectionLevel: 'H'
  });
}

export async function generateQRBuffer(
  value: string,
  options?: { size?: number; dark?: string; light?: string }
): Promise<Buffer> {
  return await QRCode.toBuffer(value, {
    width: options?.size || 600,
    margin: 2,
    color: {
      dark: options?.dark || '#0A0E20',
      light: options?.light || '#FFFFFF'
    },
    errorCorrectionLevel: 'H'
  });
}
