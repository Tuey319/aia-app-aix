import { Image } from 'expo-image';

interface Props { width?: number; height?: number; }

export function IllustrationFamilyInsurance({ width = 280, height = 280 }: Props) {
  return (
    <Image
      source={require('../../../assets/illustrations/FamilyInsurance.png')}
      style={{ width, height }}
      contentFit="contain"
    />
  );
}
