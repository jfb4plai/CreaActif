import QRCode from 'qrcode'

export async function generateQRDataURL(text) {
  return QRCode.toDataURL(text, {
    width: 120,
    margin: 1,
    color: { dark: '#0a9370', light: '#ffffff' },
  })
}
