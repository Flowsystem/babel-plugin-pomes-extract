function message() {}

message({
  id: 'foo',
  comment: 'bar',
});

message({
  id: 'c' + 'o' + 'n' + 'c' + 'atenate',
  comment: 'bar',
});

message({
  id: 'bar',
  comment: 'foo',
  future: true,
});
