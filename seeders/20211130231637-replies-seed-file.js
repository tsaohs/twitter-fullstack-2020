'use strict'
const faker = require('faker')
const seeder = require('../config/seeder.js')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    // await queryInterface.bulkInsert(
    //   'Replies',
    //   Array.from({ length: 50 }).map((d, i) => ({
    //     id: i + 1,
    //     UserId: Math.floor(Math.random() * (6 - 2 + 1) + 1),
    //     TweetId: Math.floor(Math.random() * (51 - 1) + 1),
    //     comment: faker.lorem.text(),
    //     createdAt: faker.date.recent(),
    //     updatedAt: new Date(),
    //   })),
    //   {}
    // )
    await queryInterface.bulkInsert('Replies', seeder.getReplies(), {})
  },

  down: async (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    await queryInterface.bulkDelete('Replies', null, {})
  },
}
