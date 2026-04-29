import { AppText } from '@/src/ui/AppText';

export function SectionHint({ text }: { text: string }) {
  return (
    <AppText
      style={{
        textAlign: 'center',
        fontSize: 12,
        color: '#728680',
        marginTop: 18,
      }}
    >
      {text}
    </AppText>
  );
}
