// Example usage for a lesson button/link:
// <button onclick="openPaidLesson('hsk3', 6, 'path/to/lesson.html')">Bài 6</button>
async function openPaidLesson(courseId, lessonNumber, targetUrl) {
  const ok = await window.UZHOU_ACCESS.requireLessonAccess(courseId, lessonNumber);
  if (ok) location.href = targetUrl;
}
