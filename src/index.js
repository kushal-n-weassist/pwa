self.addEventListener('unhandledrejection', (event) => {
  if (event.reason?.name === 'InvalidStateError') {
    event.preventDefault();
  }
});