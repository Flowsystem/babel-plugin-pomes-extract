
function message() {}

message({
  id: 'foo message',
  comment: 'bar comment (singular)',
});


message({
  id: 'foo message',
  pluralId: 'foo message plural',
  pluralCondition: 'n',
  values: {
    n: 2,
  },
  comment: 'bar comment (plural)',
});
