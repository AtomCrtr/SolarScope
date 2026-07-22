(function () {
  try {
    var theme = localStorage.getItem('solarscope-theme') || 'dark'
    document.documentElement.setAttribute('data-theme', theme)
  } catch {
    document.documentElement.setAttribute('data-theme', 'dark')
  }
})()
