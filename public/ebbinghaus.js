/**
 * 艾宾浩斯遗忘曲线复习调度引擎
 *
 * 复习间隔（小时）: 0.33(20min) → 1h → 24h → 48h → 144h(6d) → 336h(14d) → 720h(30d)
 * 存储: localStorage，key = 'ebbinghaus_reviews'
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'ebbinghaus_reviews';
  const INTERVALS_HOURS = [0.33, 1, 24, 48, 144, 336, 720]; // 7 轮
  const INTERVAL_LABELS = ['20分钟后', '1小时', '1天', '2天', '6天', '14天', '30天'];

  // ──────────────────────── 数据管理 ────────────────────────

  function load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (_) {
      return {};
    }
  }

  function save(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  // ──────────────────────── 核心 API ────────────────────────

  /**
   * 标记一篇文章为"已复习"
   * @param {string} articleId - 文章标识（如 'mysql', 'redis', 或完整路径）
   */
  function markReviewed(articleId) {
    const data = load();
    const now = Date.now();
    const entry = data[articleId] || { reviewCount: 0, history: [] };

    entry.reviewCount = (entry.reviewCount || 0) + 1;
    entry.lastReview = now;
    entry.history = entry.history || [];
    entry.history.push(now);

    // 计算下一次复习时间
    const idx = Math.min(entry.reviewCount - 1, INTERVALS_HOURS.length - 1);
    const intervalMs = INTERVALS_HOURS[idx] * 3600 * 1000;
    entry.nextReview = now + intervalMs;
    entry.intervalLabel = INTERVAL_LABELS[idx];

    data[articleId] = entry;
    save(data);
    return entry;
  }

  /**
   * 获取所有文章的复习状态
   */
  function getAllStatus() {
    const data = load();
    const now = Date.now();
    const result = {};

    for (const [id, entry] of Object.entries(data)) {
      const isOverdue = entry.nextReview && entry.nextReview < now;
      const isDueSoon = entry.nextReview && (entry.nextReview - now) < 3600 * 1000; // 1h内
      result[id] = {
        ...entry,
        isOverdue,
        isDueSoon,
        isCompleted: !entry.nextReview || isOverdue ? false : entry.reviewCount >= INTERVALS_HOURS.length,
        progress: Math.min((entry.reviewCount || 0) / INTERVALS_HOURS.length, 1),
        progressPercent: Math.round(Math.min((entry.reviewCount || 0) / INTERVALS_HOURS.length, 1) * 100),
        // "需要复习" = 到了复习时间 或 还没学过(不在data里)
        needsReview: !entry.nextReview || entry.nextReview <= now,
        stageLabel: entry.reviewCount > 0 && entry.reviewCount <= INTERVALS_HOURS.length
          ? `第${entry.reviewCount}轮 · 下轮${entry.intervalLabel || '—'}`
          : null
      };
    }
    return result;
  }

  /**
   * 获取今日待复习列表
   */
  function getTodayReviews() {
    const statuses = getAllStatus();
    const now = Date.now();
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    return Object.entries(statuses)
      .filter(([_, s]) => s.needsReview || (s.nextReview && s.nextReview <= endOfDay.getTime()))
      .map(([id, s]) => ({ id, ...s }));
  }

  /**
   * 获取全局进度
   */
  function getGlobalProgress(articleCount) {
    const statuses = getAllStatus();
    const ids = Object.keys(statuses);
    const reviewed = ids.filter(id => statuses[id].reviewCount > 0).length;
    const completed = ids.filter(id => statuses[id].progress >= 1).length;
    const due = ids.filter(id => statuses[id].needsReview).length;
    return {
      total: articleCount || ids.length,
      started: reviewed,
      completed,
      due,
      overallPercent: articleCount ? Math.round((completed / articleCount) * 100) : 0
    };
  }

  /**
   * 重置一篇文章（重新开始复习）
   */
  function resetArticle(articleId) {
    const data = load();
    delete data[articleId];
    save(data);
  }

  /**
   * 完全重置
   */
  function resetAll() {
    localStorage.removeItem(STORAGE_KEY);
  }

  // ──────────────────────── UI 辅助 ────────────────────────

  /**
   * 推断当前页面的 articleId
   */
  function currentArticleId() {
    const path = window.location.pathname;
    const match = path.match(/\/([a-z0-9_-]+)\.html$/);
    return match ? match[1] : 'index';
  }

  /**
   * 格式化时间差
   */
  function timeAgo(ts) {
    if (!ts) return '尚未学习';
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return '刚刚';
    if (mins < 60) return `${mins}分钟前`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}小时前`;
    const days = Math.floor(hours / 24);
    return `${days}天前`;
  }

  /**
   * 格式化"距下次复习还有多久"
   */
  function timeUntil(nextTs) {
    if (!nextTs) return '可开始';
    const diff = nextTs - Date.now();
    if (diff <= 0) return '<span style="color:#f87171">⚠️ 已逾期</span>';
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}分钟后`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}小时后`;
    const days = Math.floor(hours / 24);
    return `${days}天后`;
  }

  // ──────────────────────── 导出 ────────────────────────
  window.Ebbinghaus = {
    INTERVALS: INTERVALS_HOURS,
    INTERVAL_LABELS,
    markReviewed,
    getAllStatus,
    getTodayReviews,
    getGlobalProgress,
    resetArticle,
    resetAll,
    currentArticleId,
    timeAgo,
    timeUntil,
    STORAGE_KEY
  };

  console.log('🧠 艾宾浩斯复习引擎已加载 · 间隔:', INTERVAL_LABELS.join(' → '));
})();
