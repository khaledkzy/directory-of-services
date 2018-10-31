exports.up = knex =>
  knex.schema
    .createTable('Organisation', table => {
      table.increments('id').primary();
      table.string('org_name');
      table.string('website');
    })
    .createTable('Branch', table => {
      table.increments('id').primary();
      table
        .integer('org_id')
        .unsigned()
        .references('id')
        .inTable('Organisation')
        .onDelete('CASCADE');
      table.string('borough')
      table.string('project')
      table.text('clients')
      table.string('tag');
    })
    .createTable('Service', table => {
      table.increments('id').primary();
      table
        .integer('branch_id')
        .unsigned()
        .references('id')
        .inTable('Branch')
        .onDelete('CASCADE');
      table.text('service_days');
      table.text('process');
      table.text('service');
    })
    .createTable('Categories', table => {
      table.increments('id').primary();
      table
        .integer('service_id')
        .unsigned()
        .references('id')
        .inTable('Service')
        .onDelete('CASCADE');
      table.varchar('cat_name');
    })
    .createTable('Address', table => {
      table.increments('id').primary();
      table
        .integer('branch_id')
        .unsigned()
        .references('id')
        .inTable('Branch')
        .onDelete('CASCADE');
      table.string('address_line');
      table.string('area');
      table.string('postcode');
      table.string('email_address');
      table.string('telephone');
    })
    .createTable('Location', table => {
      table.increments('id').primary();
      table
        .integer('address_id')
        .unsigned()
        .references('id')
        .inTable('Address')
        .onDelete('CASCADE');
      table.string('lat');
      table.string('long');
    })
    .createTable('Users', table => {
      table.increments('id').primary();
      table.string('email');
      table.string('organisation');
      table.string('fullname');
      table.string('salt_password');
      table.date('last_updated');
      table.string('resetPasswordToken');
      table.string('resetPasswordExpires');
      table.string('role');
    });

exports.down = knex =>
  knex.schema
    .dropTableIfExists('Organisation')
    .dropTableIfExists('Branch')
    .dropTableIfExists('Service')
    .dropTableIfExists('Categories')
    .dropTableIfExists('Address')
    .dropTableIfExists('Location')
    .dropTableIfExists('Users');
