import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/convert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    if (!res.ok) {
      alert('오류가 발생했습니다!');
      setLoading(false);
      return;
    }
    const blob = await res.blob();
    const postId = url.replace(/\/$/, '').split('/').pop();
    const filename = `${postId}.md`;
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'Arial' }}>
      <h1>네이버 블로그 → Markdown</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="블로그 주소를 입력하세요"
          style={{ width: '100%', padding: 8, margin: '8px 0' }}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? '변환 중…' : '변환하기'}
        </button>
      </form>
      <p style={{ fontSize: 12, color: '#666' }}>공개 글만 지원합니다.</p>
    </div>
  );
}
