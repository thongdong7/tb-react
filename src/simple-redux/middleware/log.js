export default function middlewareLog(dispatch, fn, ...args) {
  console.log(`Call ${fn.name} with arguments`, args);
}
