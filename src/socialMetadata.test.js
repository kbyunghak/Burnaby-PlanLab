import fs from 'fs';
import path from 'path';

const indexHtml = fs.readFileSync(
  path.join(process.cwd(), 'public', 'index.html'),
  'utf8'
);
const socialPreview = fs.readFileSync(
  path.join(process.cwd(), 'public', 'social-preview-v3.jpg')
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
  expect(
    indexHtml.match(
      /content="https:\/\/kbyunghak\.github\.io\/Burnaby-PlanLab\/social-preview-v3\.jpg"/g
    )
  ).toHaveLength(3);
  expect(indexHtml).toContain(
    'property="og:image:type" content="image/jpeg"'
  );
  expect(indexHtml).toContain(
    'property="og:site_name" content="Burnaby PlanLab"'
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

test('publishes a valid JPEG social preview', () => {
  expect(socialPreview[0]).toBe(0xff);
  expect(socialPreview[1]).toBe(0xd8);
  expect(socialPreview[socialPreview.length - 2]).toBe(0xff);
  expect(socialPreview[socialPreview.length - 1]).toBe(0xd9);
});
