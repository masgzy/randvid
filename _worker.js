// _worker.js
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const params = url.searchParams;

    // /api 或 /api/ 返回随机视频流
    if (path === '/api' || path === '/api/') {
      try {
        // 获取文件名参数，默认为 'video.json'
        let filename = params.get('f') || 'video.json';
        
        // 安全校验：确保文件名不包含路径遍历和只允许.json文件
        if (filename.includes('..') || !filename.endsWith('.json')) {
          return new Response('无效的文件名', { status: 400 });
        }

        // 1. 获取随机视频的 URL
        const res = await fetch(`https://ghweb.996855.xyz/video/random/${filename}`);
        const data = await res.json();

        if (!Array.isArray(data) || data.length === 0) {
          return new Response('视频列表为空或格式错误', { status: 500 });
        }

        const randomIndex = Math.floor(Math.random() * data.length);
        const videoUrl = data[randomIndex].url;

        console.log(`随机视频 URL: ${videoUrl}`);

        // 2. 获取视频流并返回
        const videoRes = await fetch(videoUrl);
        
        // 3. 返回视频流，并设置正确的 Content-Type
        return new Response(videoRes.body, {
          headers: {
            'Content-Type': 'video/mp4', // 如果是 .webm 改成 'video/webm'
            'Access-Control-Allow-Origin': '*', // 允许跨域
          },
        });
      } catch (err) {
        console.error('获取视频失败：', err);
        return new Response('获取视频失败', { status: 500 });
      }
    }

    // 其他路径返回 404
    return new Response('页面不存在', { status: 404 });
  },
};
