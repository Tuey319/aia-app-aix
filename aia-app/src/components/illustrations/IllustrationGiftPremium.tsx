import { Image } from 'expo-image';

interface Props { width?: number; height?: number; }

export function IllustrationGiftPremium({ width = 280, height = 280 }: Props) {
  return (
    <Image
      source={require('../../../assets/illustrations/GiftPremiumAnimation.png')}
      style={{ width, height }}
      contentFit="contain"
    />
  );
}
