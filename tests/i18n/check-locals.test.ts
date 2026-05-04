import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const { analyzeLocals } = require('../../scripts/check-locals.js');

function writeFile(filePath: string, content: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

test('detects locale key drift and unused baseline entries', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'check-locals-'));

  writeFile(
    path.join(root, 'src/locals/zh-CN.json'),
    JSON.stringify(
      {
        'report.streakTitle': '已申报 128 天',
        'report.body': '慢一点也没关系',
        'report.primaryButton': '我活着',
        'tabs.home': '首页',
        'tabs.items': '事项'
      },
      null,
      2
    )
  );

  writeFile(
    path.join(root, 'src/locals/en-US.json'),
    JSON.stringify(
      {
        'report.streakTitle': 'Checked in for 128 days',
        'report.primaryButton': "I'm alive",
        'report.extraLabel': 'Extra',
        'tabs.home': 'Home',
        'tabs.items': 'Items'
      },
      null,
      2
    )
  );

  writeFile(
    path.join(root, 'src/i18n/messages.ts'),
    `
      export const messages = {} as const;
    `
  );

  writeFile(
    path.join(root, 'src/app/report.tsx'),
    `
      import { ReportScreen } from '../../src/pages/report/ReportScreen';
      import { useI18n } from '../../src/i18n/useI18n';

      export default function ReportRoute() {
        const { messages } = useI18n();
        return (
          <ReportScreen
            copy={{
              streakTitle: messages['report.streakTitle'],
              primaryButton: messages['report.primaryButton'],
            }}
          />
        );
      }
    `
  );

  writeFile(
    path.join(root, 'src/pages/report/ReportScreen.tsx'),
    `
      export function ReportScreen({ copy }: { copy: { streakTitle: string; primaryButton: string } }) {
        const resolvedCopy = copy;
        return (
          <>
            <Text>{resolvedCopy.streakTitle}</Text>
            <Text>{resolvedCopy.primaryButton}</Text>
          </>
        );
      }
    `
  );

  writeFile(
    path.join(root, 'src/app/(tabs)/_layout.tsx'),
    `
      import { useI18n } from '../../src/i18n/useI18n';

      export default function TabsLayout() {
        const { messages } = useI18n();
        return <>{messages['tabs.home']}</>;
      }
    `
  );

  const result = analyzeLocals(root);

  expect(result.localeDiffs['en-US']).toEqual({
    missing: ['report.body'],
    extra: ['report.extraLabel']
  });

  expect(result.unusedBaselinePaths).toEqual(['report.body', 'tabs.items']);
});
