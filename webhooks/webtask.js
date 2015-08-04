module.exports = function(ctx, req, res) {
  // context.webhook contains the webhook payload provided by GitHub
  // context.data contains URL query and webtask token parameters
  callback(null, { req: req, res:res, ctx:ctx });
}
