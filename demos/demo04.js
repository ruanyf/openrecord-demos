const Store = require('openrecord/store/sqlite3')

const store = new Store({
  file: './sample.db'
})

class Employee extends Store.BaseModel{
  static definition(){
    this.validatesPresenceOf('FirstName', 'LastName')
  }
}
store.Model(Employee)

store.ready(async () => {
  const employee = Employee.new();
  employee.set({
    FirstName: 'yifeng'
  });
  await employee.save();
}).then(() => {
  console.log('执行完成');
  process.exit(0);
}).catch(e => {
  console.log('发生错误', e)
  process.exit(1);
});
