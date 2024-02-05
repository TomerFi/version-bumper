/**
 * @param source Source for the bump, any semver string or 'git' to fetch from tags. Defaults to 'git'.
 * @param path When source is 'git', path of the git repository. Defaults to './'.
 * @param bump Target bump, one of major, minor, patch, or auto. Defaults to 'auto'. Source non-git, requires non-auto.
 * @param label Development iteration build label. Defaults to '-dev'.
 * @param preset Conventional preset to use. Defaults to 'angular'.
 * @returns {Promise<original: '2.1.4'|bump: 'major'|next: '3.0.0'|dev: '3.0.0-dev'>}
 */
module.exports = async function (source = 'git', path = './', bump = 'auto', label = '-dev', preset = 'angular') {
  return require('./bumper')({source, path, bump, label, preset})
}
