/**
 * Entrypoint for modules access to the bumper function.
 *
 * source: Source for the bump, any semver string or 'git' to fetch from tags. Defaults to 'git'.
 * path: When source is 'git', path of the git repository. Defaults to './'.
 * bump: Target bump, 'major' | 'minor' | 'patch' | 'auto'. Defaults to 'auto' which can only be used with a 'git' source.
 * label: Development iteration build label. Defaults to '-dev'.
 * preset: Conventional preset to use. Defaults to 'angular'.
 *
 * @param {{source: string, path: string, bump: string, label: string, preset: string}} opts options to configure bumper
 * @returns {Promise<{current: string, bump: string, next: string, dev: string}>}
 */
module.exports = async function (opts) {
  return require('./bumper')({source: 'git', path: './', bump: 'auto', label: '-dev', preset: 'angular', ...opts})
}
