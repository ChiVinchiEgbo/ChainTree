const constants = {
  links: {
    twitter: 'https://x.com/chaintree_dev',
    github: 'https://github.com/chaintree',
    telegram: 'https://t.me/chaintree',
  },
}

export const links = constants.links
export default constants
export function camelize(text) {
  const a = text.toLowerCase().replace(/[-_\s.]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
  return a.substring(0, 1).toLowerCase() + a.substring(1)
}
