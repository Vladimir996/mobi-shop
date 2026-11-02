'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

const REQUIRED_FIELDS = ['customerName', 'email', 'phone', 'address', 'city'];

module.exports = createCoreController('api::order.order', ({ strapi }) => ({
  /**
   * Javni endpoint za kreiranje porudzbine.
   * Klijent salje samo documentId proizvoda i kolicinu - cene i ukupan iznos
   * se racunaju ovde iz baze, kako kupac ne bi mogao da podmetne cenu.
   */
  async create(ctx) {
    const data = ctx.request.body?.data ?? {};

    for (const field of REQUIRED_FIELDS) {
      if (!data[field] || String(data[field]).trim() === '') {
        return ctx.badRequest(`Polje "${field}" je obavezno.`);
      }
    }

    const items = Array.isArray(data.items) ? data.items : [];
    if (items.length === 0) {
      return ctx.badRequest('Korpa je prazna.');
    }

    const orderItems = [];
    let total = 0;

    for (const item of items) {
      const quantity = Number.parseInt(item.quantity, 10);
      if (!item.documentId || !Number.isInteger(quantity) || quantity < 1) {
        return ctx.badRequest('Neispravna stavka u korpi.');
      }

      const product = await strapi.documents('api::product.product').findOne({
        documentId: item.documentId,
        status: 'published',
      });

      if (!product) {
        return ctx.badRequest('Proizvod iz korpe vise nije dostupan.');
      }
      if (product.stock < quantity) {
        return ctx.badRequest(`Nema dovoljno na stanju: ${product.name} (dostupno: ${product.stock}).`);
      }

      const price = Number(product.price);
      total += price * quantity;
      orderItems.push({
        documentId: product.documentId,
        name: product.name,
        price,
        quantity,
        subtotal: price * quantity,
      });
    }

    const order = await strapi.documents('api::order.order').create({
      data: {
        customerName: data.customerName.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        address: data.address.trim(),
        city: data.city.trim(),
        note: data.note ? String(data.note).trim() : null,
        items: orderItems,
        total,
        orderStatus: 'primljena',
      },
    });

    // Umanji stanje (i draft i objavljenu verziju proizvoda)
    for (const item of orderItems) {
      const product = await strapi.documents('api::product.product').findOne({
        documentId: item.documentId,
        status: 'published',
      });
      await strapi.db.query('api::product.product').updateMany({
        where: { documentId: item.documentId },
        data: { stock: Math.max(0, product.stock - item.quantity) },
      });
    }

    ctx.status = 201;
    return { data: { documentId: order.documentId, total, items: orderItems } };
  },
}));
