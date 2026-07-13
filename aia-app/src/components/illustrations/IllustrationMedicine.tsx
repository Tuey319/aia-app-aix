import { Image } from 'expo-image';

interface Props { width?: number; height?: number; }

export function IllustrationMedicine({ width = 280, height = 280 }: Props) {
  return (
    <Image
      source={require('../../../assets/illustrations/Medicine.png')}
      style={{ width, height }}
      contentFit="contain"
    />
  );
}
