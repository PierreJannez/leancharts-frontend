// 📁 generateChartImages.ts
import { toPng } from 'html-to-image';

export async function generateChartImages(chartRefs: (HTMLDivElement | null)[]): Promise<string[]> {
  const images: string[] = [];

  for (const ref of chartRefs) {
    if (!ref) continue;
    try {
      const dataUrl = await toPng(ref, { cacheBust: true, backgroundColor: 'white' });
      images.push(dataUrl);
    } catch (err) {
      console.error('Error capturing graphic :', err);
    }
  }

  return images;
}
