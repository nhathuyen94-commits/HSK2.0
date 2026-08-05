// UZHOU course access control.
// Free lessons: 1-5. Paid lessons: 6+.
// Course IDs: hsk1, hsk2, hsk3, hsk4.
(function () {
  const FREE_LESSONS = 5;

  function getCourseFromPath() {
    const p = location.pathname.toLowerCase();
    if (/hsk3|h3[-_]/.test(p)) return 'hsk3';
    if (/hsk4|h4[-_]/.test(p)) return 'hsk4';
    if (/hsk2|h2[-_]/.test(p)) return 'hsk2';
    if (/hsk1|h1[-_]/.test(p)) return 'hsk1';
    return null;
  }

  async function getClient() {
    if (!window.supabase || !window.SUPABASE_URL || !window.SUPABASE_ANON_KEY ||
        window.SUPABASE_URL.startsWith('PASTE_')) return null;
    return window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
  }

  async function hasPaidAccess(courseId) {
    const client = await getClient();
    if (!client) return false;
    const { data: { user } } = await client.auth.getUser();
    if (!user) return false;

    const { data, error } = await client
      .from('user_courses')
      .select('course_id, expires_at')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .maybeSingle();

    if (error || !data) return false;
    return !data.expires_at || new Date(data.expires_at) > new Date();
  }

  window.UZHOU_ACCESS = {
    FREE_LESSONS,
    getCourseFromPath,
    hasPaidAccess,

    // Call this before opening lesson 6+.
    async requireLessonAccess(courseId, lessonNumber) {
      if (Number(lessonNumber) <= FREE_LESSONS) {
        return true;
      }

      const client = await getClient();
      if (!client) {
        alert('Khóa học này cần được cấu hình Supabase trước khi mở bài học trả phí.');
        return false;
      }

      const { data: { user } } = await client.auth.getUser();
      if (!user) {
        location.href = '/auth/login.html';
        return false;
      }

      const allowed = await hasPaidAccess(courseId);
      if (!allowed) {
        alert('Bài 6 trở đi dành cho học viên đã được cấp quyền khóa học. Vui lòng đăng nhập bằng tài khoản đã mua khóa học hoặc liên hệ quản trị viên.');
        return false;
      }
      return true;
    }
  };
})();
