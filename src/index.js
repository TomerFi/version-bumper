/**
 * Entrypoint for modules access to the bumper function.
 *
 * @param {string} source Source for the bump, any semver string or 'git' to fetch from tags. Defaults to 'git'.
 * @param {string} path When source is 'git', path of the git repository. Defaults to './'.
 * @param {string} bump Target bump, 'major' | 'minor' | 'patch' | 'auto'. Defaults to 'auto' which can only be used with a 'git' source.
 * @param {string} label Development iteration build label. Defaults to '-dev'.
 * @param {string} preset Conventional preset to use. Defaults to 'angular'.
 * @returns {Promise<{original: string, bump: string, next: string, dev: string}>}
 */
module.exports = async function (source = 'git', path = './', bump = 'auto', label = '-dev', preset = 'angular') {
  return require('./bumper')({source, path, bump, label, preset})
}
