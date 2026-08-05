// UZHOU authentication helper.
// Requires supabase-config.js to be loaded before this file.

(function () {
  const ready = window.supabase &&
    window.SUPABASE_URL &&
    !window.SUPABASE_URL.startsWith("PASTE_") &&
    window.SUPABASE_ANON_KEY &&
    !window.SUPABASE_ANON_KEY.startsWith("PASTE_");

  if (!ready) {
    console.warn("Supabase is not configured yet.");
    return;
  }

  window.uzhouSupabase = window.supabase.createClient(
    window.SUPABASE_URL,
    window.SUPABASE_ANON_KEY
  );

  window.uzhouAuth = {
    async requireLogin() {
      const { data: { user } } = await window.uzhouSupabase.auth.getUser();
      if (!user) {
        location.href = "auth/login.html";
        return null;
      }
      return user;
    },

    async signOut() {
      await window.uzhouSupabase.auth.signOut();
      location.href = "auth/login.html";
    },

    async hasCourse(courseId) {
      const { data, error } = await window.uzhouSupabase
        .from("user_courses")
        .select("course_id, expires_at")
        .eq("user_id", (await window.uzhouSupabase.auth.getUser()).data.user.id)
        .eq("course_id", courseId)
        .maybeSingle();

      if (error || !data) return false;
      return !data.expires_at || new Date(data.expires_at) > new Date();
    }
  };
})();
