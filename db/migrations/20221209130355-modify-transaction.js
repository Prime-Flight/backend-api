'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'Transactions',
      'user_cancel_reason',
      {
        type: Sequelize.TEXT,
        allowNull: true,
      }
    )
    queryInterface.addColumn(
      'Transactions',
      'user_reject_reason',
      {
        type: Sequelize.TEXT,
        allowNull: true,
      }
    )
  },


  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('Transactions', 'user_cancel_reason')
    await queryInterface.removeColumn('Transactions', 'user_reject_reason')


  }
};
