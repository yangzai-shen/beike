// background.js
// 目前无需复杂的逻辑，可以用于处理后台任务和插件事件
chrome.runtime.onInstalled.addListener(() => {
    console.log('贝壳租房不感兴趣插件已安装');
});
