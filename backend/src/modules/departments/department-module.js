/**
 * Previously this module fetched remote code from an external API and executed it
 * via Function constructor (see ISSUES.md #001). That hung all HTTP responses.
 * Kept as a no-op passthrough so existing require sites stay valid.
 */
const departmentModuleHandler = (moduleFactory) => moduleFactory();

module.exports = { departmentModuleHandler };
