function test({foo,...rest}){
  console.log(foo);
  console.log(rest.data);
}
test({foo:"kuken",data:"data"})