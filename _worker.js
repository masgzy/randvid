// _worker.js
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, ''); // 移除路径末尾的斜杠

    // 根路径返回 Hello World
    if (path === '') {
      return new Response('Hello World', {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    // /api 或 /api/ 都返回随机视频 302 跳转
    if (path === '/api') {
      try {
        const res = await fetch('https://ghweb.996855.xyz/video/random/video.json');
        const data = await res.json();

        if (!Array.isArray(data) || data.length === 0) {
          return new Response('视频列表为空或格式错误', { status: 500 });
        }

        const randomIndex = Math.floor(Math.random() * data.length);
        const selectedVideo = data[randomIndex];

        console.log(`随机跳转视频：${selectedVideo.name} -> ${selectedVideo.url}`);

        return Response.redirect(selectedVideo.url, 302);
      } catch (err) {
        console.error('获取视频列表失败：', err);
        return new Response('获取视频列表失败', { status: 500 });
      }
    }

    // 其他路径返回 404
    return new Response('页面不存在', { status: 404 });
  },
};
