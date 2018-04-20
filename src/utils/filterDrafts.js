// @flow

const filterDrafts = (pages: Object[]) => pages.filter(page => !page.draft)

module.exports = filterDrafts
