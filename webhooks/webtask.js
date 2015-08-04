module.exports = function(context, callback) {
  // context.webhook contains the webhook payload provided by GitHub
  // context.data contains URL query and webtask token parameters
  callback(null, { context: context.webhook });
}
