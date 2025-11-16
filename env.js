window.__ENV = {
  SUPABASE_URL: "https://dkfissjbxaevmxcqvpai.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrZmlzc2pieGFldm14Y3F2cGFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNzQ3NjIsImV4cCI6MjA3ODY1MDc2Mn0.jvhYLRPvgkOa-Yx4So9-b3MfouLoRl9f-iHgkldxEcI",
  API_KEY: "AIzaSyBR7d7PlUJrGpVfUXHhd37s-qMebcUHKOc",
  // En local usa el microservicio PHP (por ejemplo, Render local o docker-compose).
  // En producción (dominio público) deja misma-origin con Apache en el contenedor.
  PHP_BASE_URL: (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? "http://localhost:8001" : ""
};
