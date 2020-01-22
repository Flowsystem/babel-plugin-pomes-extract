
function message() {}

message({
  id: 'foo message',
  comment: 'bar comment (singular)',
});

message({
  id: 'foo message',
  context: 'singular context',
  comment: 'bar comment (singular)',
});

message({
  id: 'foo message',
  pluralId: 'foo message plural',
  pluralCondition: 'n',
  values: {
    n: 2,
  },
  context: 'plural context',
  comment: 'bar comment (plural)',
});
