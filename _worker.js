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

    // /api 或 /api/ 返回抖音视频的最终 MP4 URL
    if (path === '/api') {
      try {
        // 1. 获取抖音视频短链接（从你的 JSON API）
        const jsonRes = await fetch('https://ghweb.996855.xyz/video/random/video.json');
        const data = await jsonRes.json();

        if (!Array.isArray(data) || data.length === 0) {
          return new Response('视频列表为空或格式错误', { status: 500 });
        }

        const randomIndex = Math.floor(Math.random() * data.length);
        const douyinShortUrl = data[randomIndex].url; // 示例：v.douyin.com/xxxx

        // 2. 模拟移动端请求，获取最终 MP4 URL
        const finalRes = await fetch(douyinShortUrl, {
          redirect: 'follow', // 自动跟随所有 302 跳转
          headers: {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 15; Xiaomi 15 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.6559.210 Mobile Safari/537.36',
            'Referer': 'https://www.douyin.com/?is_from_mobile_home=1&recommend=1',
          },
        });

        const finalVideoUrl = finalRes.url; // 最终的 .mp4 地址
        console.log('抖音真实视频地址:', finalVideoUrl);

        // 3. 返回 302 跳转到最终 MP4 URL
        return Response.redirect(finalVideoUrl, 302);
      } catch (err) {
        console.error('解析抖音视频失败:', err);
        return new Response('解析抖音视频失败', { status: 500 });
      }
    }

    // 其他路径返回 404
    return new Response('页面不存在', { status: 404 });
  },
};
