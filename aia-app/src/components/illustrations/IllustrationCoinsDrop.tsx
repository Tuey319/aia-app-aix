import { Image } from 'expo-image';

interface Props { width?: number; height?: number; }

export function IllustrationCoinsDrop({ width = 280, height = 280 }: Props) {
  return (
    <Image
      source={require('../../../assets/illustrations/CoinsDrop.png')}
      style={{ width, height }}
      contentFit="contain"
    />
  );
}
