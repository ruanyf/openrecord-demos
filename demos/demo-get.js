const Store = require('openrecord/store/sqlite3')

const store = new Store({
  file: './sample.db'
})

class Employee extends Store.BaseModel{
}
store.Model(Employee)

store.ready(async () => {
  const employee = await Employee.get([1, 2, 3]);
  console.log(employee.length)
}).then(() => {
  console.log('执行完成');
  process.exit(0);
})
