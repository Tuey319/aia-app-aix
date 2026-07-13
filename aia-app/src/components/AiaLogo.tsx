import { Image } from 'expo-image';

interface Props {
  size?: number;
}

// The source asset is a flattened, multi-color trace (not a clean alpha-channel
// icon), so it's rendered in its natural colors — no tintColor — on light/white
// surfaces only. See badge usages: they're white-filled for this reason.
export function AiaLogo({ size = 24 }: Props) {
  return (
    <Image
      source={require('../../assets/aia_logo.png')}
      style={{ width: size, height: size }}
      contentFit="contain"
    />
  );
}
