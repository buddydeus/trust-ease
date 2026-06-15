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
        'dailyReport.title': '今天先确认一次',
        'dailyReport.description': '只记录今日状态',
        'dailyReport.primaryAction': '我今天平安',
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
        'dailyReport.title': 'Confirm once today',
        'dailyReport.primaryAction': "I'm safe today",
        'dailyReport.extraLabel': 'Extra',
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
              title: messages['dailyReport.title'],
              primaryButton: messages['dailyReport.primaryAction'],
            }}
          />
        );
      }
    `
  );

  writeFile(
    path.join(root, 'src/pages/report/ReportScreen.tsx'),
    `
      import { useI18n } from '../../src/i18n/useI18n';

      export function ReportScreen({ copy }: { copy: { title: string; primaryButton: string } }) {
        const { getMessage } = useI18n();
        const resolvedCopy = copy;
        return (
          <>
            <Text>{resolvedCopy.title}</Text>
            <Text>{getMessage('dailyReport.description')}</Text>
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
    missing: ['dailyReport.description'],
    extra: ['dailyReport.extraLabel']
  });

  expect(result.unusedBaselinePaths).toEqual(['tabs.items']);
});
