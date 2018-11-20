
exports.up = function(knex, Promise) {
    return knex.schema.table('Users', function(t) {
        t.string('verification_code')
      });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('Users', function(t) {
        t.dropColumn('verification_code');
      });
};