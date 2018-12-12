const Store = require('openrecord/store/sqlite3')

const store = new Store({
  file: './sample.db'
})

class Employee extends Store.BaseModel{
}
store.Model(Employee)

store.ready(async () => {
  const employee = await Employee;
  console.log(employee.length)
}).then(() => {
  console.log('执行完成');
  process.exit(0);
})
