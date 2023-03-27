import React from 'react';

import {
  IconApple,
  IconBeer,
  IconCoins,
  IconQuestionMark,
  IconRocket,
  TablerIconsProps
} from '@tabler/icons-react';

// TODO; common comp
export type SupportedIcons = 'rocket' | 'coins' | 'apple' | 'beer';
interface IconifyProps extends TablerIconsProps {
  icon: SupportedIcons;
}

// TODO: Extend

// TODO: Ask if ok
const icons = {
  rocket: () => <IconRocket />,
  coins: () => <IconCoins />,
  apple: () => <IconApple />,
  beer: () => <IconBeer />
};

export function Iconify({ icon, ...props }: IconifyProps) {
  const Icon = icons[icon] as any;

  if (!Icon) {
    return <IconQuestionMark {...props} />;
  }

  return <Icon {...props} />;
}
