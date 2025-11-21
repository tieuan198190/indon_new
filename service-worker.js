// service-worker.js
// Mục tiêu: hủy đăng ký service worker cũ và xóa cache, sau đó reload lại trang.

self.addEventListener("install", (event) => {
  // Cho SW mới active ngay lập tức
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    // 1. Xóa toàn bộ cache cũ
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => {
            return caches.delete(key);
          })
        )
      )
      .then(() =>
        // 2. Hủy đăng ký service worker
        self.registration.unregister()
      )
      .then(() =>
        // 3. Reload lại tất cả client (tab) đang mở site này
        self.clients.matchAll()
      )
      .then((clients) => {
        clients.forEach((client) => {
          client.navigate(client.url);
        });
      })
  );
});

// Không xử lý fetch nữa, để browser luôn lấy trực tiếp từ server
self.addEventListener("fetch", () => {});
