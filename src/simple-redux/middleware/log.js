export default function logMiddleware(dispatch, fn, ...args) {
  console.log(`Call ${fn.name} with arguments`, args);
}
