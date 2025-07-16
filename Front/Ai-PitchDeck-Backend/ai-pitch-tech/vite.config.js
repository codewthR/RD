export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // Ensure this matches the backend URL
        changeOrigin: true,
        secure: false, // Set to false if you're not using HTTPS
      }
    }
  }
}
