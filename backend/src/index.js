'use strict';

const seed = require('./seed');
const attachProductImages = require('./product-images');

// Akcije koje su dostupne bez prijave (javni sajt)
const PUBLIC_ACTIONS = [
  'api::product.product.find',
  'api::product.product.findOne',
  'api::brand.brand.find',
  'api::brand.brand.findOne',
  'api::category.category.find',
  'api::category.category.findOne',
  'api::order.order.create',
];

async function setPublicPermissions(strapi) {
  const publicRole = await strapi.db
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });

  if (!publicRole) return;

  for (const action of PUBLIC_ACTIONS) {
    const existing = await strapi.db
      .query('plugin::users-permissions.permission')
      .findOne({ where: { action, role: publicRole.id } });

    if (!existing) {
      await strapi.db.query('plugin::users-permissions.permission').create({
        data: { action, role: publicRole.id },
      });
    }
  }
}

module.exports = {
  register(/* { strapi } */) {},

  async bootstrap({ strapi }) {
    await setPublicPermissions(strapi);
    await seed(strapi);
    await attachProductImages(strapi);
  },
};
