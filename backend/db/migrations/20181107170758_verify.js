
exports.up = function(knex, Promise) {
    return knex.schema.table('Users', function(t) {
        t.string('verified')
      });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('Users', function(t) {
        t.dropColumn('verified');
      });
};