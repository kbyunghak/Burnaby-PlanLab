import fs from 'fs';
import path from 'path';

const indexHtml = fs.readFileSync(
  path.join(process.cwd(), 'public', 'index.html'),
  'utf8'
);

test('publishes complete Open Graph and Twitter card metadata', () => {
  expect(indexHtml).toContain(
    'property="og:title"'
  );
  expect(indexHtml).toContain(
    'content="Burnaby PlanLab — Interactive City Planning Simulator"'
  );
  expect(indexHtml).toContain(
    'property="og:image"'
  );
  expect(indexHtml).toContain(
    'content="https://kbyunghak.github.io/Burnaby-PlanLab/social-preview.png"'
  );
  expect(indexHtml).toContain(
    'property="og:image:width" content="1200"'
  );
  expect(indexHtml).toContain(
    'property="og:image:height" content="630"'
  );
  expect(indexHtml).toContain(
    'name="twitter:card" content="summary_large_image"'
  );
  expect(indexHtml).toContain(
    'rel="canonical"'
  );
});
