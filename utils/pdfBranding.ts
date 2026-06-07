import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';

const PDF_BADGE_ASSET = require('../assets/images/pdf-certified-badge.png');
const PDF_LOGO_ASSET = require('../assets/images/logo-header.png');

type PdfBrandingImages = {
  badgeDataUri: string;
  logoDataUri: string;
};

let cachedBrandingImages: Promise<PdfBrandingImages> | null = null;

const assetToDataUri = async (assetModule: number, mimeType: string) => {
  const asset = Asset.fromModule(assetModule);
  await asset.downloadAsync();
  const uri = asset.localUri || asset.uri;
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return `data:${mimeType};base64,${base64}`;
};

export const getPdfBrandingImages = () => {
  cachedBrandingImages ||= Promise.all([
    assetToDataUri(PDF_BADGE_ASSET, 'image/png'),
    assetToDataUri(PDF_LOGO_ASSET, 'image/png'),
  ]).then(([badgeDataUri, logoDataUri]) => ({ badgeDataUri, logoDataUri }));

  return cachedBrandingImages;
};
