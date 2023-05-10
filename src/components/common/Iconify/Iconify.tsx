import React from 'react';

import { IconQuestionMark, TablerIconsProps } from '@tabler/icons-react';

import { ICONS } from 'utils';

interface IconifyProps extends TablerIconsProps {
  icon: string;
}

export function Iconify({ icon, ...props }: IconifyProps) {
  const iconObject = ICONS.find((i) => i.value === icon);

  if (!iconObject) {
    return <IconQuestionMark {...props} />;
  }

  const Icon = iconObject.component;

  return <Icon {...props} />;
}
