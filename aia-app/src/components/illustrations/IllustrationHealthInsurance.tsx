import { Image } from 'expo-image';

interface Props { width?: number; height?: number; }

export function IllustrationHealthInsurance({ width = 280, height = 280 }: Props) {
  return (
    <Image
      source={require('../../../assets/illustrations/HealthInsurance.png')}
      style={{ width, height }}
      contentFit="contain"
    />
  );
}
