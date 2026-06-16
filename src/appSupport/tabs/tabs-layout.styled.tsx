import { View } from 'react-native';

import styled from 'styled-components/native';

export const TabIconSquareFrame = styled(View)`
  width: 18px;
  height: 18px;
  align-items: center;
`;

export const TabHomeRoof = styled(View)<{ $fill: string; $stroke: string }>`
  position: absolute;
  top: 2px;
  width: 12px;
  height: 12px;
  background-color: ${p => p.$fill};
  border-top-width: 1.5px;
  border-left-width: 1.5px;
  border-color: ${p => p.$stroke};
  transform: rotate(45deg);
`;

export const TabHomeBase = styled(View)<{ $fill: string; $stroke: string }>`
  position: absolute;
  bottom: 2px;
  width: 13px;
  height: 10px;
  border-width: 1.5px;
  border-top-width: 0;
  border-color: ${p => p.$stroke};
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
  background-color: ${p => p.$fill};
`;

export const TabItemsClip = styled(View)<{ $fill: string; $stroke: string }>`
  width: 17px;
  height: 18px;
  border-width: 1.5px;
  border-color: ${p => p.$stroke};
  border-radius: 4px;
  background-color: ${p => p.$fill};
  padding-horizontal: 3px;
  padding-top: 4px;
  gap: 3px;
`;

export const TabItemsLine = styled(View)<{
  $stroke: string;
  $muted: boolean;
}>`
  height: 1.5px;
  border-radius: 2px;
  background-color: ${p => p.$stroke};
  opacity: ${p => (p.$muted ? 0.55 : 1)};
`;

export const TabMyAvatar = styled(View)<{ $fill: string; $stroke: string }>`
  width: 7px;
  height: 7px;
  border-radius: 4px;
  border-width: 1.5px;
  border-color: ${p => p.$stroke};
  background-color: ${p => p.$fill};
`;

export const TabMyShoulders = styled(View)<{ $fill: string; $stroke: string }>`
  margin-top: 2px;
  width: 14px;
  height: 8px;
  border-width: 1.5px;
  border-color: ${p => p.$stroke};
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom-width: 0;
  background-color: ${p => p.$fill};
`;
