import fs from 'fs';
import path from 'path';

const indexHtml = fs.readFileSync(
  path.join(process.cwd(), 'public', 'index.html'),
  'utf8'
);
const socialPreview = fs.readFileSync(
  path.join(process.cwd(), 'public', 'social-preview-v2.png')
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
      /content="https:\/\/kbyunghak\.github\.io\/Burnaby-PlanLab\/social-preview-v2\.png"/g
    )
  ).toHaveLength(2);
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

test('keeps the social preview at the recommended Open Graph dimensions', () => {
  expect(socialPreview.subarray(1, 4).toString('ascii')).toBe('PNG');
  expect(socialPreview.readUInt32BE(16)).toBe(1200);
  expect(socialPreview.readUInt32BE(20)).toBe(630);
});
