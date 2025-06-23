import cheerio from 'cheerio';
import TurndownService from 'turndown';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('잘못된 요청입니다');
  }
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: '주소를 입력하세요' });

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('페이지를 불러올 수 없습니다');
    const html = await response.text();
    const $ = cheerio.load(html);
    let content =
      $('div.se-main-container').html() ||
      $('div.postViewArea').html();
    if (!content) throw new Error('본문을 찾을 수 없습니다');

    const turndown = new TurndownService({
      headingStyle: 'atx',
      bulletListMarker: '*'
    });
    const md = turndown.turndown(content);
    const postId = url.replace(/\/$/, '').split('/').pop();

    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${postId}.md`
    );
    res.setHeader('Content-Type', 'text/markdown');
    res.send(md);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
