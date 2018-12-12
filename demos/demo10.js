const Store = require('openrecord/store/sqlite3')

const store = new Store({
  file: './sample.db'
})

class Employee extends Store.BaseModel{
  static definition() {
    this.getter('fullname', function () {return this.FirstName + ' ' + this.LastName});
  }

  FullName(){
    return this.FirstName + ' ' + this.LastName
  }
}
store.Model(Employee)

store.ready(async () => {
  const employee = await Employee.find(1)
  console.log(employee.fullname)
}).then(() => {
  console.log('执行完成');
  process.exit(0);
});
